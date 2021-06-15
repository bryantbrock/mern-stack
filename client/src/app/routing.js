import React from 'react'
import {Login, Signup, ResetPassword} from 'app/auth'
import {Switch, Route} from 'react-router-dom'
import {withRouter} from 'react-router-dom'
import {Dashboard} from 'app/dashboard'
import {connect} from 'react-redux'
import {navigate} from 'navigation'
import {smartLoad} from 'app/auth/Auth'
import LoadingScreen from 'app/LoadingScreen'

const publicRoutes = ['/signup', '/reset-password']
const routes = [
  {path: '/reset-password', title: 'Reset Password', component: ResetPassword},
  {path: '/', title: 'Dashboard', component: Dashboard},
  {path: '/signup', title: 'Signup', component: Signup},
  {path: '/login', title: 'Login', component: Login},
]

const enhance = connect(
  state => ({
    smartLoading: state.auth.smartLoading,
  }), {smartLoad}
)

class Routing extends React.Component {
  renderRoutes() {
    return <Switch>
    {routes.map((route, idx) =>
      <Route
        exact={!route.notExact}
        key={idx}
        path={route.path}
        component={withRouter(route.component)}
        title={route.title} />
      )}
    </Switch>
  }
  render() {
    const {smartLoading} = this.props

    if (
      !localStorage.getItem('userId') ||
      !localStorage.getItem('isAuth')
    ) {

      // Don't redirect if a public route
      if (publicRoutes.includes(window.location.pathname)) {
        return this.renderRoutes()
      }

      navigate('/login')

      return this.renderRoutes()
    }

    this.props.smartLoad()

    return smartLoading ? <div className="flex justify-center w-full pt-40">
      <div className="spinner spinner-md" />
    </div> : this.renderRoutes()
  }
}

export default enhance(Routing)