import {  Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./Provider/authProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Container className="mb-5">
        <Outlet />
        <ToastContainer />
      </Container>
    </AuthProvider>
  )
}

export default App
