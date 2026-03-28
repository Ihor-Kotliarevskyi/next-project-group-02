import axios from 'axios';

const clientApi = axios.create({
  baseURL: 'http://localhost:5000', 
  withCredentials: true,
});

export default clientApi;