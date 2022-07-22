import axios from 'axios';

let axiosConfig = {
  headers: {     
    "Content-Type": "application/json",
    'Accept': 'Token',
  }
};

const port = process.env.REACT_APP_PORT || 8081

const host = '0.0.0.0';

export default axios.create({
  baseURL: `${host}:${port}`,
  headers: axiosConfig.headers
});
