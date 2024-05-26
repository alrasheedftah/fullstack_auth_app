import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home";
import { SignIn } from "../pages/SignIn";
import { SignUp } from "../pages/SignUp";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children:
        [
            { path: "singin", element: <PublicRoute><SignIn /> </PublicRoute> },
            { path: "singup", element: <PublicRoute> <SignUp /> </PublicRoute>},
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