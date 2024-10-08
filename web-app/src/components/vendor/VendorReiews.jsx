import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Form, Button } from 'react-bootstrap';
import Header from '../Header';
import { getVendorRatingById } from '../../api/vendorRating';

const VendorReviews = ({ vendorId }) => {
    const [unreadReviews, setUnreadReviews] = useState([]);
    const [readReviews, setReadReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('unread');
    
  // get vendor reviews by vendor ID
    useEffect(() => {
      const fetchVendorReviews = async () => {
        try {
          const reviews = await getVendorRatingById(vendorId); 
          setUnreadReviews(reviews); // set all reviews as unread initially
        } catch (error) {
          console.error('Error fetching vendor reviews:', error);
        }
      };
      fetchVendorReviews();
    }, [vendorId]);
  
    // Handle a read review
  const markReadReview = (reviewId) => {
    const reviewToMark = unreadReviews.find((review) => review.id.timestamp === reviewId);
    if (reviewToMark) {
      setReadReviews([...readReviews, reviewToMark]); // Add to read reviews
      setUnreadReviews(unreadReviews.filter((review) => review.id.timestamp !== reviewId)); // Remove from unread
    }
    };
    
  return (
    <Container style={{ marginLeft: '200px', padding: '20px' }}>
      <Header title="Reviews and Ratings"></Header>
      <Tabs activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)} id="reviews-tabs" className="mb-3">
        
        <Tab  eventKey="unread"
              title={
                <span className={activeTab === 'unread' ? 'text-success' : ''}>
                  Unread ({unreadReviews.length})
                </span>
              }>
          {unreadReviews.length === 0 ? (
            <p>No unread reviews.</p>
          ) : (
            unreadReviews.map((review) => (
              <Card key={review.id} className="mb-3 bg-light shadow-sm">
                <Card.Body>
                  <Card.Title>{review.customerName}</Card.Title>
                  <Card.Text>
                    <strong>Rating:</strong> {review.rating}/5
                  </Card.Text>
                  <Card.Text>
                    <strong>Comment:</strong> {review.comment}
                  </Card.Text>
                  <Form.Check 
                    type="checkbox" 
                            onChange={() => markReadReview(review.id.timestamp)} //mark read checkbox
                            className="p-3 btn-outline-success position-absolute top-0 end-0"
                  />
                </Card.Body>
              </Card>
            ))
          )}
        </Tab>

        <Tab eventKey="read"
              title={
                <span className={activeTab === 'read' ? 'text-success' : ''}>
                  Read ({readReviews.length})
                </span>
              }>
          {readReviews.length === 0 ? (
            <p>No read reviews.</p>
          ) : (
            readReviews.map((review) => (
              <Card key={review.id} className="mb-3 bg-light shadow-sm">
                <Card.Body>
                  <Card.Title>{review.customerName}</Card.Title>
                  <Card.Text>
                    <strong>Rating:</strong> {review.rating}/5
                  </Card.Text>
                  <Card.Text>
                    <strong>Comment:</strong> {review.comment}
                  </Card.Text>
                </Card.Body>
              </Card>
            ))
          )}
        </Tab>
              </Tabs>
    </Container>
  );
};

export default VendorReviews;
