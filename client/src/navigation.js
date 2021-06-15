import {createBrowserHistory} from 'history'

export const history = createBrowserHistory()
export const navigate = path => history.push(path)