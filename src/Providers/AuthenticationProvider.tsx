import React, { createContext, useContext, useMemo } from "react";
import { toast } from "react-toastify";

import httpServices from "../Services/http.services";
import { baseAuthApi } from "../Constants/api";
import { AxiosResponse } from "axios";

interface AuthContextType {
  isLogged: boolean;
  signIn: (payload: SignInPayload) => void;
  logout: () => void;
  signUp: (payload: SignUpPayload) => void;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface loginResponse {
  access_token: string;
  refresh_token: string;
}

export interface SignUpPayload {
  name: string;
  password: string;
  retypePassword: string;
  email: string;
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  signIn: () => {},
  logout: () => {},
  signUp: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

const AuthenticationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const [isLogged, setIsLogged] = React.useState<boolean>(!!accessToken);

  const signIn = async (payload: SignInPayload) => {
    const toastId = toast.loading("Logging in...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      const response: AxiosResponse<loginResponse> =
        await httpServices.axios.post(`${baseAuthApi}/login`, payload);
      if (response.data) {
        setIsLogged(true);
        toast.update(toastId, {
          render: "Login successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
      } else {
        toast.update(toastId, {
          render: "Login failed",
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error?.message || "Login failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    const toastId = toast.loading("Signing up...", {
      isLoading: true,
      autoClose: false,
    });
    try {
      const response: AxiosResponse<loginResponse> =
        await httpServices.axios.post(`${baseAuthApi}/register`, payload);
      if (response.data) {
        toast.update(toastId, {
          render: "Sign up successfully",
          type: "success",
          autoClose: 2000,
          isLoading: false,
        });

        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh_token);
        setIsLogged(true);
      } else {
        toast.update(toastId, {
          render: "Sign up failed",
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
      }
    } catch (error: any) {
      console.log("error", error.message);
      toast.update(toastId, {
        render: error?.message || "Sign up failed",
        type: "error",
        autoClose: 2000,
        isLoading: false,
      });
    }
  };

  const logout = () => {
    setIsLogged(false);
    localStorage.removeItem("userId");
  };

  const value = useMemo(() => {
    return {
      signIn,
      logout,
      isLogged,
      signUp,
    };
  }, [signIn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthenticationProvider;
