import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import ListingDetails from "./pages/ListingDetails";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import NavbarComponent from "./components/NavbarComponent";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import "./styles/main.scss";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavbarComponent setShowLogin={setShowLogin} />

        <Container fluid className="flex-grow-1 mt-0 p-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/listings" element={<Listings />} />
            <Route path="/listing/:id" element={<ListingDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>

        <Footer />

        <LoginModal 
          show={showLogin} 
          handleClose={() => setShowLogin(false)} 
          switchToRegister={switchToRegister} 
        />
        <RegisterModal 
          show={showRegister} 
          handleClose={() => setShowRegister(false)} 
          switchToLogin={switchToLogin} 
        />
      </div>
    </Router>
  );
}

export default App;