import axios from 'axios';
import userManager from 'src/commons/helpers/userManager';
const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    console.log(err);
    if (
      err.response.status === 401 &&
      !!err.response.data &&
      err.response.data.Error !== null &&
      err.response.data.Error !== undefined &&
      err.response.data.Error === 'NoPermission'
    ) {
      window.location.href = '/admin/unauthorized';
    } else if (err.response.status === 401) {
      userManager.removeUser();
      window.location.href = '/';
    }
  }
);

export type ResultObject = {
  message: string | null;
  success: boolean;
  data: any | null;
  isWarning?: boolean | false;
};


export default api;
