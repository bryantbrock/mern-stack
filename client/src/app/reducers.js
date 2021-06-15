import {combineReducers} from 'redux'
import {Auth} from 'app/auth'
import {Finances} from 'app/finances'

export default combineReducers({
  auth: Auth.reducer,
  finances: Finances.reducer,
})