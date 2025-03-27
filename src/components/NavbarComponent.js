import React from "react";
import { Navbar, Nav, Button, Container, Form, FormControl, Dropdown } from "react-bootstrap";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { getToken, getUserDetails, destroyToken } from "../utils/token";
import { useNavigate } from "react-router-dom";

function NavbarComponent({ setShowLogin }) {
  const isLoggedIn = !!getToken();
  const [userName] = getUserDetails();
  const navigate = useNavigate();

  const handleLogout = () => {
    destroyToken();
    navigate("/");
    window.location.reload();
  };

  return (
    <Navbar className="py-4" bg="light" variant="light" expand="lg">
      <Container className="d-flex align-items-center">
        <Navbar.Brand href="/">
          <h2 className="mb-1 mx-2">Auction Zone</h2>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/listings">Listings</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
          {isLoggedIn ? (
            <Dropdown align="end">
              <Dropdown.Toggle variant="dark" id="dropdown-basic">
                <FaUser className="me-2" /> {userName}
              </Dropdown.Toggle>

              <Dropdown.Menu className="responsive-dropdown">
                <Dropdown.Item href="/profile">
                  <FaUser className="me-2" /> Profile
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} className="text-danger">
                  <FaSignOutAlt className="me-2 text-danger" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="btn btn-dark" onClick={() => setShowLogin(true)}>
              <FaUser className="me-1" /> Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;