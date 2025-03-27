import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { userLogin } from "../utils/users";
import { storeUser } from "../utils/token";

function LoginModal({ show, handleClose, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await userLogin({ email, password });
      const { accessToken, name, credits } = response.data;

      storeUser(accessToken, name, credits);
      handleClose();
      window.location.reload();
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Welcome back!
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@stud.noroff.no"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="dark"
            type="submit"
            className="w-100"
            disabled={loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <small className="text-muted">
          Not a member?{" "}
          <span
            onClick={switchToRegister}
            role="button"
            style={{ color: "#248AFC", cursor: "pointer", fontWeight: 500 }}
          >
            Sign up here
          </span>
        </small>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginModal;
