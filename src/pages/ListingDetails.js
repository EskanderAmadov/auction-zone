import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuction, setNewBid } from "../utils/listings";
import { Container, Spinner, Button, Badge, Alert, Form, Image } from "react-bootstrap";
import { getToken, getUserDetails } from "../utils/token";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [placingBid, setPlacingBid] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isLoggedIn = !!getToken();
  const [userName] = getUserDetails();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await getAuction(id);
        setListing(res.data);
      } catch (err) {
        console.error("Error loading listing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setPlacingBid(true);

    const now = new Date();
    const endsAt = new Date(listing.endsAt);

    if (now > endsAt) {
      setError("This auction has ended. You can no longer place a bid.");
      setPlacingBid(false);
      return;
    }

    if (listing.seller?.name === userName) {
      setError("You cannot bid on your own listing.");
      setPlacingBid(false);
      return;
    }

    try {
      const res = await setNewBid(id, Number(bidAmount));
      setSuccess("Bid placed successfully!");
      setBidAmount("");

      const updated = await getAuction(id);
      setListing(updated.data);
    } catch (err) {
      console.error("Bid error:", err);
      setError("Failed to place bid. Make sure your bid is higher than the current one.");
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!listing) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">Listing not found.</Alert>
      </Container>
    );
  }

  const latestBid = listing.bids?.length > 0 ? listing.bids[listing.bids.length - 1].amount : null;

  return (
    <Container className="py-5">
      <div className="d-flex flex-column flex-lg-row">
        <div className="flex-shrink-0 me-lg-4 mb-4 mb-lg-0" style={{ maxWidth: "500px", width: "100%" }}>
          <div style={{ maxHeight: "450px", overflow: "hidden" }}>
            <img
              src={listing.media?.[0]?.url || "/no-image.jpg"}
              alt={listing.media?.[0]?.alt || listing.title}
              className="img-fluid rounded shadow w-100 h-100 object-fit-cover"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>

        <div className="flex-grow-1">
          <h2 className="mb-2">{listing.title}</h2>
          <p className="text-muted mb-3">By: {listing.seller?.name || "Unknown"}</p>
          <p>{listing.description}</p>

          <div className="mb-3">
            <strong>Tags:</strong>{" "}
            {listing.tags?.length > 0 ? (
              listing.tags.map((tag, index) => (
                <Badge bg="secondary" className="me-1" key={index}>
                  #{tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted fst-italic">No tags</span>
            )}
          </div>

          <p className="mb-1">
            <strong>Ends:</strong> {new Date(listing.endsAt).toLocaleString()}
          </p>
          <p className="mb-1">
            <strong>Bids:</strong> {listing.bids.length}
          </p>
          <p className="mb-3">
            <strong>Current bid:</strong>{" "}
            {isLoggedIn ? (
              latestBid !== null ? (
                <span className="text-primary fw-semibold fs-5">${latestBid}</span>
              ) : (
                <span className="text-muted fst-italic">No bids</span>
              )
            ) : (
              <span className="text-muted fst-italic">Log in to view current bid</span>
            )}
          </p>

          {isLoggedIn ? (
            <Form className="mb-4" onSubmit={handleBidSubmit}>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <Form.Group controlId="placeBid">
                <Form.Label>Enter your bid</Form.Label>
                <Form.Control
                  type="number"
                  min={latestBid ? latestBid + 1 : 1}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="$"
                  required
                />
              </Form.Group>
              <Button variant="warning" className="w-100 mt-3" type="submit" disabled={placingBid}>
                {placingBid ? "Placing..." : "Place Bid"}
              </Button>
            </Form>
          ) : (
            <Button variant="warning" className="w-100 mb-4" disabled>
              Login to Bid
            </Button>
          )}
        </div>
      </div>

      <div>
        <h1 className="mb-1 mt-5 fw-bold">Bid History</h1>
        <div className="mt-5 custom-bid-history">
          <hr />
          {listing.bids?.length > 0 ? (
            listing.bids
              .slice()
              .reverse()
              .map((bid) => (
                <div key={bid.id} className="mb-3 border-bottom pb-2 d-flex align-items-center">
                  {bid.bidder?.avatar?.url && (
                    <Image
                      src={bid.bidder.avatar.url}
                      alt={bid.bidder.avatar.alt || "avatar"}
                      roundedCircle
                      width={40}
                      height={40}
                      className="me-2"
                    />
                  )}
                  <div>
                    <strong>${bid.amount}</strong>{" "}
                    <span className="text-muted d-block">
                      by {bid.bidder?.name || "Unknown"} — {new Date(bid.created).toLocaleString()}
                    </span>
                    <small className="text-muted fst-italic">{bid.bidder?.email}</small>
                  </div>
                </div>
              ))
          ) : (
            <p className="fst-italic text-muted" style={{ opacity: 0.6 }}>
              No bids yet.
            </p>
          )}
        </div>
      </div>
    </Container>
  );
}

export default ListingDetails;
