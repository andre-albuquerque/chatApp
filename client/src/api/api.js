import axios from 'axios';

const axiosConfig = {
  headers: {     
    "Content-Type": "application/json",
    'Accept': '*/*',
    'Access-Control-Allow-Origin': '*',
  }
};

const url = process.env.REACT_APP_BACKEND// || 'api' 

console.log('url', url)

export default axios.create({ 
  baseURL: 'http://localhost:8000',
  headers: axiosConfig.headers
});