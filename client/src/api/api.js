import axios from 'axios';

let axiosConfig = {
  headers: {     
    "Content-Type": "application/json",
    'Accept': 'Token',
  }
};

const port = process.env.REACT_APP_PORT || 8081

export default axios.create({
  baseURL: `http://localhost:${port}`,
  headers: axiosConfig.headers
});
