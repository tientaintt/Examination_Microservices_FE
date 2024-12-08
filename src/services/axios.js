import axios from 'axios';
import { getRefreshToken, removeCredential, saveToken } from './ApiService';

const instance = axios.create({
      baseURL: 'http://localhost:5000/api/v1',
      'Content-Type': 'application/json',
});

let isRefreshing = false;
instance.interceptors.response.use(function (response) {
      console.log(response.data)
      return response?.data;
}, async function (error) {
      console.log(error)
      const prevRequest = error?.config;
      if (error.response && error?.response?.status === 401 && !prevRequest?.sent) {
            prevRequest.sent = true;
            if (!isRefreshing) {
                  let refresh_token = getRefreshToken();
                  console.log(refresh_token)
                  if (refresh_token != null) {
                        try {


                              const resp = (await refreshToken(refresh_token));
                              console.log(resp)
                              saveToken(resp.data.accessToken, refresh_token, null);
                              prevRequest.headers = {
                                    authorization: `Bearer ${resp.data.accessToken}`,
                                    'Content-Type': 'application/json'
                              };
                              return instance(prevRequest);
                        } catch (error) {
                              console.log("Refresh token request failed:", error);
                              removeCredential();
                        } finally {
                              isRefreshing = false;
                        }
                  }
            } else {
                  await new Promise(resolve => {
                        const interval = setInterval(() => {
                              if (!isRefreshing) {
                                    clearInterval(interval);
                                    resolve();
                              }
                        }, 100);
                  });
                  // Retry the failed request with the new token
                  return instance(prevRequest);
            }

      }

      return Promise.reject(error);
});

const refreshToken = (data) => instance({
      url: '/identity/refresh_token',
      method: 'post',
      data: {
            'token': data
      }
})
export default instance;