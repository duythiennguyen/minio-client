import api from 'src/apis/api';
import apiIdentity from 'src/apis/apiIdentity';

export const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    apiIdentity.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete apiIdentity.defaults.headers.common['Authorization'];
  }
};