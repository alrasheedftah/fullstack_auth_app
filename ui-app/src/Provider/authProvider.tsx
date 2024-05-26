import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthTokenResponse, UserModel, UserSignupModel } from "../Models/AuthResponse";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const api_url = "http://localhost:3000";

type AuthContextType = {
    user: UserModel | null;
    setToken: (newToken : string) => void;
    signUp: (userSignupModel : UserSignupModel) => void;
    signIn: (userModel : UserModel) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
  };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [user, setUser] = useState<UserModel | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("current_user");

        if (token && user) {
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          setToken(token);
          setToken(user);
        } else {
          delete axios.defaults.headers.common["Authorization"];
          localStorage.removeItem("token");

        }
    }, [token]);

    const signUp = async ( userModel : UserSignupModel) => {
        try {
            const data = await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-up`, { ...userModel });
            if(data)
            {
              localStorage.setItem("token", data?.data.token);
              localStorage.setItem("current_user", JSON.stringify(userModel));
              setUser(userModel!);
              setToken(data?.data.token)
              navigate("/");
              toast.success("Login Success!");
            }

          } catch (error) {
            // Todo HandleError
            toast.error(`There Isssu To Login ${error}`);
          }
      };

      const signIn = async (userModel : UserModel) => {
        try {
            const data = await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-in`, { ...userModel });

            localStorage.setItem("token", data?.data.token);
            setToken(data?.data.token)
            localStorage.setItem("current_user", JSON.stringify(userModel));
            setUser({ ...userModel, email: data?.data.email})
            toast.success("Login Success!");
            navigate("/");

        } catch (error) {
            // Todo HandleError
            toast.error(`There Isssu To Login ${error}`);
          }
      };


    const isLoggedIn = () => !!token;

    const logout = async () => {
        await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-out`, {});
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        navigate("/");
    };

    // Memoized value of the authentication context
    const contextValue = useMemo(
        () => ({
        user,
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