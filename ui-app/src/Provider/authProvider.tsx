import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthTokenResponse } from "../Models/AuthResponse";
import { useNavigate } from "react-router-dom";

const api = "http://localhost:3000/api";

type AuthContextType = {
    // user: UserProfile | null;
    token: string | null;
    setToken: (newToken : string) => void;
    signUp: (email: string, username: string, password: string) => void;
    signIn: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
  };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {
    // State to hold the authentication token
    const [token, setToken_] = useState<string | null>(localStorage.getItem("token"));
    const navigate = useNavigate();
    // Function to set the authentication token
    const setToken = (newToken : string) => {
        setToken_(newToken);
    };

    useEffect(() => {
        if (token) {
         axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        localStorage.setItem("token", token);
        } else {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        }
    }, [token]);

    const signUp = async (
        email: string,
        username: string,
        password: string
      ) => {
        try {
            const data = await axios.post<AuthTokenResponse>(`${api}/signup`, {
              email: email,
              username: username,
              password: password,
            });

            localStorage.setItem("token", data?.data.token);
            navigate("/");

          } catch (error) {
            // Todo HandleError
            console.log(error)
          }
      };

      const signIn = async (
        email: string,
        password: string
      ) => {
        try {
            const data = await axios.post<AuthTokenResponse>(`${api}/signup`, {
              email: email,
              password: password,
            });

            localStorage.setItem("token", data?.data.token);
            navigate("/");

        } catch (error) {
            // Todo HandleError
            console.log(error)
          }
      };


    const isLoggedIn = () => !!token;

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
        token,
        setToken,
        signUp,
        signIn,
        logout,
        isLoggedIn
        }),
        [token]
    );

      return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
    };

    export const useAuth = () => {
    return useContext(AuthContext);
};