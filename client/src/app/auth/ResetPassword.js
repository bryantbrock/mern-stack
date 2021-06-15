import React, { Component } from 'react'
import {Anchor} from 'components'
import {navigate} from 'navigation'
import {api} from 'app/api'

export class ResetPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {loading: false, email: '', success: false}
    this.resetPassword = this.resetPassword.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  onChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }
  async resetPassword(e) {
    e.preventDefault()
    this.setState({loading: true})
    const {email} = this.state
    const {data: {success}} = await api.post(`/reset-password/${email}`)

    return success ? this.setState({success, loading: false}) : this.setState({loading: false})
  }
  renderEmailSent(email) {
    return <div className="pb-8">
      An email has been sent to {email}. Click on the link to reset your password.
    </div>
  }
  render() {
    const {loading, email, success} = this.state

    return <div className="circuit-pattern h-screen pt-32">
      <div className="flex flex-col px-16 py-16 mx-auto card-sm login">
        {success ? this.renderEmailSent(email) :
        <form onSubmit={this.resetPassword} className="flex flex-col">
          <label className="py-4">Enter your email below to receive a password reset link in your inbox.</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.onChange}/>
          <button type="submit" className="py-4 flex justify-center">
            {loading ? <div className="spinner spinner-white spinner-sm" /> : 'Reset Password'}
          </button>
        </form>}
        <div className="flex justify-center">
          <Anchor onClick={() => navigate('/login')}>Back to Sign In</Anchor>
        </div>
      </div>
    </div>
  }
}

export default ResetPassword
