import axios from 'axios'

export const api = axios.create({
  // TODO: put this into env variable
  baseURL: 'http://localhost:3333',
})
