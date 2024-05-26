import axios from "axios";
import { toast } from "react-toastify";

// Todo Create BaseErr Interface
export const errorHandler = (error: any) => {
  if (axios.isAxiosError(error)) {
    const err = error.response;
    if (err?.data?.error) {
      toast.warning(err.data);
    } else if (err?.status == 401) {
      toast.warning("Please login");
      window.history.pushState({}, "LoginPage", "/login");
    } else if (err) {
      toast.warning(err?.data);
    }
  }
};