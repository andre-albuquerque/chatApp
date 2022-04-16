import axios from 'axios';

let axiosConfig = {
  headers: {     
    "Content-Type": "application/json",
    'Accept': 'Token'
  }
};

export default axios.create({
  baseURL: 'http://localhost:8081',
  headers: axiosConfig.headers
});
