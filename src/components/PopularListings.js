import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { getAuctions } from "../utils/listings";
import ListingCard from "../components/ListingCard";
import { getCachedAuctions } from "../utils/cachedFetch";

function PopularListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularListings = async () => {
      try {
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
        }, "popularListings", 300000); 

        const top = data
          .map((listing) => ({
            ...listing,
            bidCount: listing.bids?.length || 0,
            latestBid:
              listing.bids?.[listing.bids.length - 1]?.amount ?? null,
          }))
          .filter((l) => l.bidCount > 0)
          .sort((a, b) => b.bidCount - a.bidCount)
          .slice(0, 3);

        setListings(top);
      } catch (error) {
        console.error("Error loading popular listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularListings();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5 d-flex align-items-center justify-content-center gap-4">
        Loading listings, please wait..
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <section className="popular-listings py-5">
      <Container>
        <h1 className="text-left mb-3 fw-bold">Popular Listings</h1>
        <h4 className="mb-4">
          Discover the most exclusive auctions available right now!
        </h4>
        <Row>
          {listings.map((listing, index) => (
            <Col md={4} key={`${listing.id}-${index}`} className="mb-5">
              <ListingCard listing={listing} showBadge={true} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default PopularListings;
