import axios from 'axios';

export const api = axios.create({
  // TODO: turn this into an env variable
  baseURL: 'http://192.168.0.231:3333',
});
