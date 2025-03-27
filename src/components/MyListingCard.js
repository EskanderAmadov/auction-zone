import React from "react";
import { Card, Button } from "react-bootstrap";

function MyListingCard({ listing, onDelete }) {
  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={listing.media?.[0]?.url || "/no-image.jpg"}
        alt={listing.media?.[0]?.alt || listing.title}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title>{listing.title}</Card.Title>

        <Card.Text className="fw-bold">
          {listing.tags?.length > 0 ? (
            listing.tags.map((tag, index) => (
              <small key={index} className="fst-italic text-muted">
                #{tag}{" "}
              </small>
            ))
          ) : (
            <small className="fst-italic text-muted" style={{ opacity: 0.5 }}>
              No tags to view
            </small>
          )}
        </Card.Text>

        <Card.Text className="text-muted">
          {listing.description?.slice(0, 80) || "No description"}
        </Card.Text>

        <div className="d-flex justify-content-start">
          <Button variant="danger" size="sm" onClick={() => onDelete(listing.id)}>
            Delete Listing
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MyListingCard;
