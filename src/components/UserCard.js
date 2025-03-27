import React from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";

function UserCard({
  userData,
  avatarUrl,
  setAvatarUrl,
  updateStatus,
  updatingAvatar,
  handleAvatarUpdate,
}) {
  return (
    <Card className="profile-card">
      <Card.Img
        variant="top"
        src={userData.avatar?.url || "/no-avatar.jpg"}
        alt={userData.avatar?.alt || userData.name}
        className="avatar-image"
      />
      <Card.Body>
        <Card.Title>{userData.name}</Card.Title>
        <Card.Text className="text-muted">{userData.email}</Card.Text>
        <Card.Text>
          <strong>Credits:</strong> {userData.credits}
        </Card.Text>

        <Form onSubmit={handleAvatarUpdate}>
          <Form.Group className="mb-2" controlId="avatarUrl">
            <Form.Control
              type="url"
              placeholder="New avatar URL"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </Form.Group>
          <Button
            type="submit"
            variant="warning"
            className="w-100"
            disabled={updatingAvatar}
          >
            {updatingAvatar ? "Updating..." : "Update Avatar"}
          </Button>
        </Form>

        {updateStatus && (
          <Alert className="mt-3" variant="info">
            {updateStatus}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserCard;
