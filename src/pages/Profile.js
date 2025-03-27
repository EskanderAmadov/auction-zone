import React, { useEffect, useState, useCallback } from "react";
import { Container, Row, Col, Button, Spinner, Modal } from "react-bootstrap";
import { getUser, getUserListings, putNewAvatar } from "../utils/users";
import { getUserDetails } from "../utils/token";
import { deleteListing } from "../utils/listings";
import CreateListingModal from "../components/CreateListingModal";
import UserCard from "../components/UserCard";
import MyListingCard from "../components/MyListingCard";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [userListings, setUserListings] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [updateStatus, setUpdateStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState(null);

  const [userName] = getUserDetails();

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await getUser(userName);
      const listings = await getUserListings(userName);
      setUserData(profile.data);
      setUserListings(listings.data);
      setAvatarUrl(profile.data.avatar?.url || "");
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  }, [userName]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    if (!avatarUrl) return;
  
    setUpdatingAvatar(true);
    try {
      await putNewAvatar(userName, {
        url: avatarUrl,
        alt: `${userName}'s avatar`,
      });
  
      setUpdateStatus("Avatar updated successfully!");
  
      window.location.reload();
    } catch (err) {
      console.error("Failed to update avatar", err);
      setUpdateStatus("Failed to update avatar");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const confirmDelete = (id) => {
    setSelectedListingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteListing(selectedListingId);
      setShowDeleteModal(false);
      setSelectedListingId(null);
      fetchProfile();
    } catch (err) {
      console.error("Failed to delete listing", err);
      alert("Something went wrong while deleting.");
    }
  };

  if (loading || !userData) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="profile-page py-5">
      <Row>
        <Col md={4} className="text-center mb-4">
          <UserCard
            userData={userData}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            updateStatus={updateStatus}
            updatingAvatar={updatingAvatar}
            handleAvatarUpdate={handleAvatarUpdate}
          />
        </Col>

        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Your Listings</h2>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              + Create Listing
            </Button>
          </div>

          <Row>
            {userListings.length > 0 ? (
              userListings.map((listing) => (
                <Col md={6} lg={4} key={listing.id} className="mb-4">
                  <MyListingCard listing={listing} onDelete={confirmDelete} />
                </Col>
              ))
            ) : (
              <p>You have no listings yet.</p>
            )}
          </Row>
        </Col>
      </Row>

      <CreateListingModal
        show={showCreateModal}
        handleClose={() => setShowCreateModal(false)}
        onCreated={fetchProfile}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this listing? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirmed}>
            Yes, delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Profile;
