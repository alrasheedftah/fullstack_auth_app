import {  Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./Provider/authProvider";

function App() {
  return (
    <AuthProvider>
      <Navbar/>
      <Container className="mb-5">
        <Outlet />
      </Container>
    </AuthProvider>
  )
}

export default App
