import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserModel, UserSignupModel } from "../Models/AuthResponse";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, signInAPI, signUpAPI } from "../Services/AuthServices";
import { errorHandler } from "../Handlers/ErrorHandler";

type AuthContextType = {
    user: UserModel | null;
    setToken: (newToken : string) => void;
    signUp: (userSignupModel : UserSignupModel) => void;
    signIn: (userModel : UserModel) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    setLoading: (val : boolean) => void;
    isLoading: boolean;
  };

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children } : { children : React.ReactNode }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [isLoading, setLoading_] = useState(false);

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
        setLoading(false);
    }, [token]);

      const signIn = async (userModel : UserModel) => {
        try {
              setLoading(true)
              const data = await signInAPI(userModel);
              if(data)
              {
                localStorage.setItem("token", data?.data.token);
                setToken(data?.data.token)
                localStorage.setItem("current_user", JSON.stringify(userModel));
                setUser({ ...userModel, email: data?.data.email})
                toast.success("Login Success!");
                navigate("/");
              }
        } catch (error) {
            setLoading(false)
            errorHandler(error);
          }
      };

      const signUp = async ( userModel : UserSignupModel) => {
        try {
            setLoading(true)
            const data = await signUpAPI(userModel);
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
            setLoading(false)
            errorHandler(error);
          }
      };

    const isLoggedIn = () => !!token;

    const signOut = async () => {
        await logout();
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
        navigate("/singin");
    };

    const setLoading = (val : boolean) => {  console.log("change" + val); setLoading_(val) };

    const contextValue = useMemo(
        () => ({
        user,
        setToken,
        signUp,
        signIn,
        logout: signOut,
        isLoggedIn,
        isLoading,
        setLoading: setLoading_ // Todo Makeit private and define accessable Method to invoke it
        }),
        [token, isLoading]
    );

      return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
      );
  };

    export const useAuth = () => {
    return useContext(AuthContext);
};