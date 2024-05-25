import { Navbar as NavbarBootstrap, Container, Nav, Button, FormLabel } from "react-bootstrap"
import { NavLink } from "react-router-dom"
import { useAuth } from "../Provider/authProvider";

export function Navbar()
{
    const { isLoggedIn, logout } = useAuth();

    return (
        <NavbarBootstrap bg="primary" data-bs-theme="dark" className="mb-5">
            <Container>
                <Nav className="me-auto">
                    <Nav.Link to={"/"} as={NavLink}>
                        Home
                    </Nav.Link>
                    <Nav.Link to={"/singin"} as={NavLink} >
                        SignIn
                    </Nav.Link>
                    <Nav.Link to={"/singup"} as={NavLink} >
                        SignUp
                    </Nav.Link>
                </Nav>
            </Container>
            {isLoggedIn() && <> <Button onClick={() => logout()}> Logout </Button>
            <FormLabel> Logged In </FormLabel> </>}
        </NavbarBootstrap>
    )
}