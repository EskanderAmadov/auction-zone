import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import { createListing } from "../utils/listings";

function CreateListingModal({ show, handleClose, onListingCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [mediaUrls, setMediaUrls] = useState([""]);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const media = mediaUrls
      .filter((url) => url.trim() !== "")
      .map((url) => ({ url }));

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const payload = {
      title,
      description,
      endsAt: new Date(endsAt).toISOString(),
      media,
      tags: tagArray,
    };

    try {
      await createListing(payload);

      if (onListingCreated) onListingCreated();
      handleClose();

      // Full sideoppdatering for å vise ny listing
      window.location.reload();

      // Rens form (valgfritt, skjer egentlig ikke før etter reload)
      setTitle("");
      setDescription("");
      setEndsAt("");
      setMediaUrls([""]);
      setTags("");
    } catch (err) {
      setError("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (index, value) => {
    const newMediaUrls = [...mediaUrls];
    newMediaUrls[index] = value;
    setMediaUrls(newMediaUrls);
  };

  const addMediaField = () => setMediaUrls([...mediaUrls, ""]);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ends At</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. art, tech, fashion"
            />
            <Form.Text className="text-muted">
              Separate tags with commas.
            </Form.Text>
          </Form.Group>

          {mediaUrls.map((url, index) => (
            <Form.Group className="mb-2" key={index}>
              <Form.Label>Image URL #{index + 1}</Form.Label>
              <Form.Control
                type="url"
                value={url}
                onChange={(e) => handleMediaChange(index, e.target.value)}
                placeholder="https://..."
              />
            </Form.Group>
          ))}

          <div className="mb-3">
            <Button variant="outline-secondary" onClick={addMediaField} size="sm">
              + Add Image Field
            </Button>
          </div>

          <Button variant="dark" type="submit" className="w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Create Listing"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreateListingModal;
