import React from "react";
import { Card, Button } from "react-bootstrap";
import { getToken } from "../utils/token";

const fallbackImage = "/no-image.jpg";

function ListingCard({ listing, showBadge = false }) {
  const isLoggedIn = !!getToken();
  const bidCount = listing.bids?.length || 0;
  const latestBid = bidCount > 0 ? listing.bids[bidCount - 1].amount : null;

  return (
    <Card className="listing-card shadow-sm h-100 d-flex flex-column">
      <div className="image-wrapper">
        <Card.Img
          variant="top"
          src={listing.media?.[0]?.url || fallbackImage}
          alt={listing.media?.[0]?.alt || listing.title}
          className="listing-image"
        />
        <div className="time-badge">
          ⏳ {new Date(listing.endsAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        {showBadge && <div className="popular-badge">Popular</div>}
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="listing-header">
          <p className="seller">
            <strong>Seller:</strong> {listing.seller?.name || "Unknown"}
          </p>
          <p className="created">
            <strong>Created:</strong>{" "}
            {new Date(listing.created).toLocaleDateString()}
          </p>
        </div>

        <Card.Title className="mb-1 card-title-custom">{listing.title}</Card.Title>

        <p className="bids mb-2">
          <strong>{bidCount} Bids</strong> | Tags:{" "}
          {listing.tags?.length > 0 ? (
            listing.tags.map((tag, index) => (
              <small key={index} className="fst-italic text-muted">#{tag} </small>
            ))
          ) : (
            <small className="fst-italic text-muted" style={{ opacity: 0.5 }}>
              No tags to view
            </small>
          )}
        </p>

        <Card.Text className="description">{listing.description}</Card.Text>

        {isLoggedIn && latestBid !== null ? (
          <p className="current-bid fs-2 fw-semibold">
            <strong>Current bid:</strong>{" "}
            <span className="bid-amount">${latestBid}</span>
          </p>
        ) : (
          <p className="current-bid">
            <strong>Current bid:</strong>{" "}
            <small className="fst-italic text-muted" style={{ opacity: 0.5 }}>
              {isLoggedIn ? "No bids" : "Log in to view current bid"}
            </small>
          </p>
        )}

        <div className="mt-auto">
          <Button variant="warning" className="read-more w-100 fw-light" href={`/listing/${listing.id}`}>
            Read More
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ListingCard;
