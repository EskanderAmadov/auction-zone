import React from "react";
import { Container, Button, Row, Col } from "react-bootstrap";

function HeroSection() {
  return (
    <section className="hero-section mb-5">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="text-center text-lg-start">
            <h1 className="hero-title text-black">Welcome to Auction Zone</h1>
            <p className="hero-subtext text-black">
              The Ultimate Destination for Buying, Selling, and Bidding!
            </p>
            <Button variant="warning" className="hero-btn mt-3 fw-light" href="/listings">
              Browse Auctions
            </Button>
          </Col>
          <Col lg={6}></Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;
