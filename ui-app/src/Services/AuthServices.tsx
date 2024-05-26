import axios from "axios";
import { AuthTokenResponse, UserModel, UserSignupModel } from "../Models/AuthResponse";
import { errorHandler } from "../Handlers/ErrorHandler";

const api_url = "http://localhost:3000";

export const signInAPI = async (userModel : UserModel) => {
  try {
    const data = await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-in`, { ...userModel });
    return data;
  } catch (error) {
    errorHandler(error);
  }
};

export const signUpAPI = async (userModel : UserSignupModel) => {
  try {
    const data = await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-up`, { ...userModel });
    return data;
  } catch (error) {
    errorHandler(error);
  }
};

export const logout = async () => {
    await axios.post<AuthTokenResponse>(`${api_url}/auth/sign-out`, {});
};
