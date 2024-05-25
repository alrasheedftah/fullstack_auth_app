import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:
        [
            { path: "singin", element: <SignIn /> },
            { path: "singup", element: <SignUp /> },
            {
            path: "",
            element: (
                <ProtectedRoute>
                <Home />
                </ProtectedRoute>
            ),
            }
        ]
    }
]);