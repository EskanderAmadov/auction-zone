import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer bg-dark text-white pt-5 pb-3 mt-auto">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Auction Zone.</h5>
            <p className="text-white">
              Auction Zone is the ultimate online marketplace where you can bid,
              win, and own unique items.
            </p>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li><a href="/listings" className="text-white text-decoration-none">Listings</a></li>
              <li><a href="/profile" className="text-white text-decoration-none">Profile</a></li>
            </ul>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Contact</h5>
            <p className="mb-1">Osloevegen 32</p>
            <p className="mb-1">0167 Oslo</p>
            <p className="mb-1">+47 123 428 23</p>
            <p className="mb-0">Hi@auctionzone.com</p>
          </Col>

          <Col md={3} className="mb-4">
            <h5 className="fw-bold">Social</h5>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="mailto:eskander.amadov@gmail.com" className="text-decoration-none">
                <FaEnvelope size={20} style={{ color: "#ff9800" }} />
              </a>
              <a href="https://github.com/EskanderAmadov/EskanderAmadov" target="_blank" rel="noreferrer" className="text-decoration-none">
                <FaGithub size={20} style={{ color: "#ff9800" }} />
              </a>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary" />
        <div className="text-center">
          <small>
            © {new Date().getFullYear()} Auction Zone. All Rights Reserved.
          </small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
