import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { getAuctions } from "../utils/listings";
import ListingCard from "./ListingCard";
import { useNavigate } from "react-router-dom";
import { getCachedAuctions } from "../utils/cachedFetch";

function AllListingsSection() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("popular");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        if (sortOption === "popular") {
          const data = await getCachedAuctions(async () => {
            let page = 1;
            let all = [];
            let hasMore = true;

            while (hasMore && page <= 2) {
              const res = await getAuctions(page, 100);
              all = [...all, ...res.data];
              hasMore = !res.meta?.isLastPage;
              page++;
            }

            return all;
          }, "allListings");

          setListings(
            data.sort((a, b) => (b.bids?.length || 0) - (a.bids?.length || 0)).slice(0, 6)
          );
        } else {
          let sortField = "";
          if (sortOption === "latest") sortField = "created";
          if (sortOption === "title-asc" || sortOption === "title-desc") sortField = "title";

          const sortOrder = sortOption === "title-asc" ? "asc" : "desc";
          const res = await getAuctions(1, 6, sortField, sortOrder);
          setListings(res.data);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [sortOption]);

  const filtered = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="all-listings-section position-relative py-5">
      <div
        className="yellow-stripe position-absolute top-0 bottom-0 start-0"
        style={{ width: "6px", background: "#ff9800" }}
      />
      <Container>
        <h1 className="mb-4 text-center text-md-start ps-md-4">All Listings</h1>

        <Row className="mb-4 gap-3 justify-content-between align-items-center ps-md-4">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col xs={12} md={4}>
            <Form.Select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="popular">Popular (by bids)</option>
              <option value="latest">Latest</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </Form.Select>
          </Col>
        </Row>

        {loading ? (
          <div className="text-center py-5 d-flex align-items-center justify-content-center gap-4">
            Loading listings, please wait..
            <Spinner animation="border" />
          </div>
        ) : (
          <Row className="ps-md-4">
            {filtered.map((listing, index) => (
              <Col md={4} className="mb-4" key={`${listing.id}-${index}`}>
                <ListingCard listing={listing} />
              </Col>
            ))}
          </Row>
        )}

        <div className="text-center pt-4">
          <Button variant="dark" onClick={() => navigate("/listings")}>
            View All
          </Button>
        </div>
      </Container>
    </section>
  );
}

export default AllListingsSection;
