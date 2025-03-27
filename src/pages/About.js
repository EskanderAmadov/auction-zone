import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";

function About() {
  return (
    <Container className="py-5">
      <Row className="align-items-center">
        <Col md={6} className="mb-4 mb-md-0">
          <Image
            src="/auction-image.jpg"
            alt="Auction illustration"
            fluid
            rounded
          />
        </Col>
        <Col md={6}>
          <h1 className="fw-bold mb-3">About Auction Zone</h1>
          <p>
            Auction Zone is a modern, community-driven online auction platform
            where you can bid, buy, and sell unique items in real-time.
            Designed for both casual users and experienced sellers, we make it
            easy to discover hot deals, rare finds, and exciting listings – all
            in one place.
          </p>
          <p>
            Whether you're here to win your next favorite item or showcase what
            you’ve got, Auction Zone makes bidding fun, secure, and social. 
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
