import React, {Component} from 'react'
import {connect} from 'react-redux'
import {authenticate, resetError} from 'app/auth/Auth'
import {Anchor} from 'components'
import {navigate} from 'navigation'

const enhance = connect(
  state => ({
    error: state.auth.error,
  }),
  {
    authenticate,
    resetError,
  }
)

class Login extends Component {
  constructor(props) {
    super(props)

    this.props.resetError()

    this.state = {
      email: '',
      password: '',
      loading: false,
      resetingPassword: false,
    }
    this.onChange = this.onChange.bind(this)
    this.signin = this.signin.bind(this)
  }
  onChange(e) {
    this.props.resetError()
    this.setState({[e.target.name]: e.target.value})
  }
  async signin(e) {
    e.preventDefault()
    this.setState({loading: true})
    this.props.resetError()

    const data = await this.props.authenticate('login', this.state)

    return data.success ? navigate('/') : this.setState({loading: false})
  }
  render() {
    const {error} = this.props
    const {loading} = this.state

    return <div className="circuit-pattern h-screen pt-32">
      <div className="flex flex-col px-20 py-16 mx-auto card-lg login">
        <h2 className="font-bold text-3xl pb-3">Sign in to your account</h2>
        {error && <div className="px-3 py-2 error">Invalid email or password.</div>}
        <form onSubmit={this.signin} className="flex flex-col">
          <label className="pt-6">Email</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}/>
          <div className="pt-6 flex justify-between">
            <label>Password</label>
            <Anchor onClick={() => navigate('/reset-password')}>Forgot your password?</Anchor>
          </div>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}/>
            <button type="submit" className="py-4 flex justify-center text-lg">
              {loading ? <div className="spinner spinner-white spinner-sm" /> : 'Continue'}
            </button>
        </form>
        <div className="mx-auto">
          Don't have an account? <Anchor onClick={() => navigate('/signup')}>Sign up</Anchor>
        </div>
      </div>
    </div>
  }
}

export default enhance(Login)
