import axios from 'axios';

const forDevsApi = axios.create({
   baseURL: 'https://www.4devs.com.br',
   headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
   },
   timeout: 5000,
});


export default forDevsApi;
