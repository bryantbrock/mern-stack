import axios from 'axios'

const baseUrl = 'http://localhost:5000/budget-a591b/us-central1/api'
// const baseUrl = 'https://us-central1-budget-a591b.cloudfunctions.net/api'

// TODO: update firebase rules to allow only requests from this app.
//    - Make a key and store in env variabales
//    - Pass through to api and make sure it matches before continuing

const request = type => (url, data, config = {}) => axios[type](baseUrl + url, data, config)

export const api = {
  post: request('post'),
  get: request('get'),
}