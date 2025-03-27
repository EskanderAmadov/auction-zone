import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

function PromoSection() {
  return (
    <section className="promo-section py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-section mb-4 mb-md-0">
            <h1 className="display-1 fw-bold">Bored?</h1>
            <p className="lead">
              Turn boredom into excitement – bid, win, and own something amazing today!
            </p>
            <Button className="fw-light" variant="warning" size="lg" href="/listings">
              Start bidding now
            </Button>
          </Col>
          <Col md={6}>
            <img
              src="/bored-portrait.jpg"
              alt="Auction excitement"
              className="img-fluid rounded shadow"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default PromoSection;
