import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { hasNoWhitespaces, registerNewUser, userLogin } from "../utils/users";
import { storeUser } from "../utils/token";

function RegisterModal({ show, handleClose, switchToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = (data) => {
    const errors = {};

    if (!data.name) errors.name = "Username is required";
    else if (!hasNoWhitespaces(data.name)) errors.name = "No spaces allowed in username";

    if (!data.email.endsWith("stud.noroff.no")) errors.email = "Must be a stud.noroff.no email";

    if (!data.password || data.password.length < 8)
      errors.password = "Password must be at least 8 characters";

    if (data.password !== data.password2)
      errors.password2 = "Passwords must match";

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const res = await registerNewUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (res?.name && res?.email) {
          const loginRes = await userLogin({
            email: formData.email,
            password: formData.password,
          });

          storeUser(
            loginRes.data.accessToken,
            loginRes.data.name,
            loginRes.data.credits
          );

          handleClose();
          window.location.reload();
        }
      } catch (err) {
        setErrorMsg("Registration failed. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Create your account</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4 pb-4">
        {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username (no spaces)"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="you@stud.noroff.no"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Minimum 8 characters"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repeat your password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
              isInvalid={!!errors.password2}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password2}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="dark" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Account"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <small className="text-muted">
          Already have an account? {" "}
          <span
            className="text-primary"
            role="button"
            onClick={switchToLogin}
            style={{ cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}
          >
            Login here
          </span>
        </small>
      </Modal.Footer>
    </Modal>
  );
}

export default RegisterModal;