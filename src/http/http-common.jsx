import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:8080/api/',
  // baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});
