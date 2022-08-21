import axios from 'axios';

let axiosConfig = {
  headers: {     
    "Content-Type": "application/json",
    'Accept': 'Token'
  }
};

const url = process.env.REACT_APP_BACKEND || 'api' 

export default axios.create({ 
  baseURL: url,
  headers: axiosConfig.headers
});