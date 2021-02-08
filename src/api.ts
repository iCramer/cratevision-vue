import axios from 'axios';

const api = axios.create({
  baseURL: 'http://api.bundlevo.com/',
  headers: {
    'Authorization': sessionStorage.getItem('jwt'),
    'Content-Type': 'application/json',
    'Accept': 'application/json, image/*'
  }
});

export default api;
