import {createSlice} from '@reduxjs/toolkit'
import {modifyUser} from 'app/auth/utils'
import {api} from 'app/api'

const initialState = {
  isLoading: false,
  smartLoading: true,
  error: null,
  user: {},
}

export const Auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    isLoading: state => ({...state, isLoading: true, error: null}),
    error: (state, action) => ({...state, error: action.payload}),
    resetError: state => ({...state, error: null}),
    loadUser: (state, action) => ({
      ...state,
      user: action.payload,
      isLoading: false,
      smartLoading: false,
      error: null,
    })
  }
})

// Actions
export const resetError = () => dispatch => dispatch(Auth.actions.resetError())
export const authenticate = (type, data) => async dispatch => {
  dispatch(Auth.actions.isLoading())

  let res, user
  try {
    if (type === "signup") {

      // Check all fields are filled
      if (!data.password || !data.confirmPassword || !data.email) {
        return {success: false, error: 'Please fill out all fields'}
      }

      // Validate info before requesting
      if (data.password !== data.confirmPassword) {
        return {success: false, error: 'Passwords do not match'}
      }

      res = await api.post('/signup', data)
      user = await api.post('/user', res.data)
    } else {
      res = await api.post('/login', data)
      user = await api.get(`/user/${res.data.uid}`)
    }

    dispatch(Auth.actions.loadUser(
      Object.assign({}, res.data, modifyUser(user))
    ))

    // Set in localStorage
    localStorage.setItem('userId', user.data.uid)
    localStorage.setItem('isAuth', true)

    return {success: true}
  } catch (err) {
    dispatch(Auth.actions.error(err.message))

    return {success: false, error: 'Email already in use or password must be at least 6 characters'}
  }
}

export const smartLoad = () => async dispatch => {
  // TODO: clear storage if token is expired
  try {
    const userUid = localStorage.getItem('userId')
    const user = await api.get(`/user/${userUid}`)

    dispatch(Auth.actions.loadUser(modifyUser(user)))
  } catch (err) {
    dispatch(Auth.actions.error(err.message))

    localStorage.clear()
  }
}

export default Auth