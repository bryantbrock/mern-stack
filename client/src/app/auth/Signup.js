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

export class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      error: false,
      loading: false,
      resetingPassword: false,
    }
    this.onChange = this.onChange.bind(this)
    this.signin = this.signin.bind(this)
  }
  onChange(e) {
    this.setState({[e.target.name]: e.target.value, error: false})
  }
  async signin(e) {
    e.preventDefault()
    this.setState({loading: true})
    this.props.resetError()

    const data = await this.props.authenticate('signup', this.state)

    return data.success ? navigate('/') : this.setState({loading: false, error: data.error})
  }
  render() {
    const {loading, error} = this.state

    return <div className="circuit-pattern h-screen pt-32">
      <div className="flex flex-col px-20 py-16 mx-auto card-lg login">
        <h2 className="font-bold text-3xl pb-3">Sign up for an account</h2>
        {error && <div className="px-3 py-2 error">{error}</div>}
        <form onSubmit={this.signin} className="flex flex-col">
          <label className="pt-6">Email</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.onChange}/>
          <label className="pt-6">Password</label>
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.onChange}/>
          <label className="pt-6">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={this.state.confirmPassword}
            onChange={this.onChange}/>
            <button type="submit" className="py-4 flex justify-center text-lg">
              {loading ? <div className="spinner spinner-white spinner-sm" /> : 'Get started'}
            </button>
        </form>
        <div className="mx-auto">
          Already have an account? <Anchor onClick={() => navigate('/login')}>Sign in</Anchor>
        </div>
      </div>
    </div>
  }
}

export default enhance(Login)
