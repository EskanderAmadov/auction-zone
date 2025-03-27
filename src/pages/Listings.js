import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Spinner,
  Pagination,
  Form,
  Alert,
} from "react-bootstrap";
import { getAuctions } from "../utils/listings";
import { getCachedAuctions } from "../utils/cachedFetch";
import ListingCard from "../components/ListingCard";

function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("popular");

  const listingsPerPage = 9;

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
          }, "allListings", 300000);

          const sorted = data
            .map((listing) => ({
              ...listing,
              bidCount: listing.bids?.length || 0,
              latestBid:
                listing.bids?.[listing.bids.length - 1]?.amount ?? null,
            }))
            .sort((a, b) => b.bidCount - a.bidCount);

          setTotalPages(Math.ceil(sorted.length / listingsPerPage));
          setListings(sorted);
        } else {
          let sortField = "";
          if (sortOption === "latest") sortField = "created";
          if (sortOption === "title-asc" || sortOption === "title-desc")
            sortField = "title";

          const sortOrder = sortOption === "title-asc" ? "asc" : "desc";

          const res = await getAuctions(
            currentPage,
            listingsPerPage,
            sortField,
            sortOrder
          );

          setListings(res.data);
          setTotalPages(res.meta?.pageCount || 1);
        }
      } catch (err) {
        console.error("Failed to fetch listings", err);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [currentPage, sortOption]);

  const filtered = listings.filter((listing) =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedListings =
    sortOption === "popular"
      ? filtered.slice(
          (currentPage - 1) * listingsPerPage,
          currentPage * listingsPerPage
        )
      : filtered;

  return (
    <Container fluid className="py-5 listings-page position-relative px-5 mt-4">
      <div className="yellow-stripe" />
      <div className="listings-header sticky-header px-5">
        <h1 className="fw-bold">All Listings</h1>
        <h4 className="mb-4">
          Browse every auction currently active on the platform.
        </h4>

        <Row className="mb-0 align-items-end gap-4">
          <Col md={6}>
            <Form.Group controlId="search">
              <Form.Label>Search by title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search listings..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="sort">
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="popular">Popular (by bids)</option>
                <option value="latest">Latest</option>
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div className="text-center py-5 d-flex align-items-center justify-content-center gap-4">
           Loading listings, please wait..
          <Spinner animation="border" />
        </div>
      ) : paginatedListings.length === 0 ? (
        <Alert variant="light" className="text-center">
          No listings match your search.
        </Alert>
      ) : (
        <>
          <Row className="m-5 g-4">
            {paginatedListings.map((listing, index) => {
              const bidCount = listing.bids ? listing.bids.length : 0;
              const latestBid =
                listing.bids && listing.bids.length > 0
                  ? listing.bids[listing.bids.length - 1].amount
                  : null;

              return (
                <Col
                  md={4}
                  key={`${listing.id}-${index}`}
                  className="mb-4 d-flex justify-content-center"
                >
                  <div className="listing-fixed-width">
                    <ListingCard
                      listing={{ ...listing, bidCount, latestBid }}
                      showBadge={false}
                    />
                  </div>
                </Col>
              );
            })}
          </Row>

          {totalPages > 1 && (
  <div className="d-flex justify-content-center mt-4">
    <Pagination>
      <Pagination.Prev
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      />

   
      <Pagination.Item
        active={currentPage === 1}
        onClick={() => setCurrentPage(1)}
      >
        1
      </Pagination.Item>
     
      {currentPage > 4 && <Pagination.Ellipsis disabled />}

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
          (page) =>
            page !== 1 &&
            page !== totalPages &&
            Math.abs(page - currentPage) <= 2
        )
        .map((page) => (
          <Pagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Pagination.Item>
        ))}

      {currentPage < totalPages - 3 && <Pagination.Ellipsis disabled />}

      {totalPages > 1 && (
        <Pagination.Item
          active={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      )}

      <Pagination.Next
        onClick={() =>
          setCurrentPage((prev) =>
            prev < totalPages ? prev + 1 : prev
          )
        }
        disabled={currentPage === totalPages}
      />
    </Pagination>
  </div>
)}
        </>
      )}
    </Container>
  );
}

export default Listings;
