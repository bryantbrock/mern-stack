import React, {Component} from 'react'
import {PlaidLink} from 'react-plaid-link'
import {connect} from 'react-redux'
import {
  getLinkToken, loadBankTransactions,
  addBankToken, getModifyLinkToken,
} from 'app/finances/Finances'
import {navigate} from 'navigation'
import {Summary, Details} from 'app/dashboard'
import {api} from 'app/api'

const enhance = connect(
  state => ({
    user: state.auth.user,
    error: state.finances.error,
  }),
  {
    getLinkToken,
    loadBankTransactions,
    getModifyLinkToken,
    addBankToken,
  }
)

export class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: null,
      loading: true,
    }
    this.fetchToken = this.fetchToken.bind(this)
    this.fetchModifyToken = this.fetchModifyToken.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
  }
  async componentDidMount() {
    await this.props.loadBankTransactions(this.props.user.uid)

    this.setState({loading: false})
  }
  async onSuccess(token, metadata) {
    this.setState({loading: true})
    const {addBankToken, loadBankTransactions, user} = this.props
    const {data} = await api.post(`/exchange-token/${token}`)

    await addBankToken(user, data, metadata)
    await loadBankTransactions(user.uid)

    this.setState({loading: false})
  }
  async fetchToken() {
    const {getLinkToken, user} = this.props
    const linkToken = await getLinkToken(user.uid, user)

    this.setState({token: linkToken})

    document.querySelector('button[type="button"]').click()
  }
  async fetchModifyToken() {
    const {getModifyLinkToken, user} = this.props
    const linkToken = await getModifyLinkToken(user.uid, user)

    this.setState({token: linkToken})

    document.querySelector('button[type="button"]').click()
  }
  renderRefresh() {
    navigate('/')

    return <div>
      Please refresh the page to see your changes.
    </div>
  }
  logout() {
    localStorage.clear()

    navigate('/login')
  }
  render() {
    const {token, loading} = this.state
    const {user, error} = this.props

    if (error) {
      console.log(error.error)
    }

    const bankConnected = user.connectedInstitutes &&
      user.connectedInstitutes.length > 0
    const logoutClass = 'rounded border border-black px-2'

    return <div className="container">
      <div className="navbar">
        <button onClick={this.fetchToken}>
          Connect a Bank
        </button>
        <div className="hidden">
          {(token && !error) ? <PlaidLink
            token={token}
            onSuccess={this.onSuccess} /> :
          token && error && <PlaidLink
            token={token}
            onSuccess={this.renderRefresh} />}
        </div>
        <button onClick={this.logout} className={logoutClass}>
          Log Out
        </button>
      </div>
      <div className="flex justify-center pt-10">
        {error ? <div>
          <div>Something has updated. Please reconnect your bank.</div>
          <button
            onClick={this.fetchModifyToken}
            className={logoutClass}>
            Reconnect Bank
          </button>
        </div> : <div>
          {loading && <div className="spinner spinner-black spinner-md" />}
          {!loading && bankConnected &&
            <div className="flex pt-8 w-11/12 mx-auto justify-between">
              <Summary />
              <Details />
            </div>}
          {!loading && !bankConnected && <div>
              Please connect a bank to get started.
            </div>}
          </div>}
      </div>
    </div>
  }
}

export default enhance(Dashboard)
