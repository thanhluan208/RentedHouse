import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ACCESS_TOKEN_KEY } from "../Providers/AuthenticationProvider";

export const REFRESH_TOKEN_KEY = "refreshToken";
export const USER_KEY = "user";

class Services {
  axios: AxiosInstance;

  constructor() {
    this.axios = axios;
    this.axios.defaults.withCredentials = false;

    //! Interceptor request
    this.axios.interceptors.request.use(
      function (config) {
        config.headers["x-timezone"] =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    //! Interceptor response
    this.axios.interceptors.response.use(
      function (config) {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY) || "";
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      async (error) => {
        console.log("error", error);
        if (error.response.status === 401) {
          localStorage.clear();
        }
        //! Handling retry when token expired
        // if (
        //   error.response.data?.statusCode === 401 &&
        //   !originalRequest?._retry
        // ) {
        //   if (!originalRequest?._retry) {
        //     originalRequest._retry = true;
        //     const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";
        //     if (refreshToken) {
        //       try {
        //         const response = await authenticationServices.postRefreshToken({
        //           token: refreshToken,
        //         });
        //         const access_token = response?.data?.data?.accessToken;
        //         const refresh_token = response?.data?.data?.refreshToken;

        //         if (access_token) {
        //           localStorage.setItem(TOKEN_KEY, access_token);
        //         }
        //         if (refresh_token) {
        //           localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
        //         }
        //         this.attachTokenToHeader(access_token);
        //         originalRequest.headers.Authorization = "Bearer" + access_token;
        //         return this.axios.request(originalRequest);
        //       } catch {
        //         window.location.reload();
        //         return Promise.reject(error);
        //       }
        //     }
        //   } else {
        //     window.location.reload();
        //     return Promise.reject(error);
        //   }
        // }

        return Promise.reject(error);
      }
    );
  }

  attachTokenToHeader(token: string) {
    this.axios.interceptors.request.use(
      function (config) {
        if (config.headers) {
          // Do something before request is sent
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
    );
  }

  setupInterceptors() {
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error?.response || {};
        if (status === 200) {
          window.localStorage.clear();
          window.location.reload();
        }

        return Promise.reject(error);
      }
    );
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.axios.get(url, config);
  }

  post(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.post(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.axios.delete(url, config);
  }

  put(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.put(url, data, config);
  }

  patch(url: string, data: any, config?: AxiosRequestConfig) {
    return this.axios.patch(url, data, config);
  }
}

export default new Services();
