import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Form, Button } from 'react-bootstrap';

const VendorReviews = () => {
    const [unreadReviews, setUnreadReviews] = useState([]);
    const [readReviews, setReadReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('unread');
    
  useEffect(() => {
    const fetchedUnreadReviews = [
      { id: 1, customer: 'John Doe', rating: 4, feedback: 'Great service and fast delivery!' },
      { id: 2, customer: 'Jane Smith', rating: 5, feedback: 'Excellent quality, will buy again.' },
      { id: 3, customer: 'Michael Johnson', rating: 3, feedback: 'Good, but shipping was slow.' },
    ];
      setUnreadReviews(fetchedUnreadReviews);
      setReadReviews([]);
  }, []);

    // Handle a read review
  const markReadReview = (reviewId) => {
    const reviewToMark = unreadReviews.find((review) => review.id === reviewId);
    if (reviewToMark) {
      setReadReviews([...readReviews, reviewToMark]); // Add to read reviews
      setUnreadReviews(unreadReviews.filter((review) => review.id !== reviewId)); // Remove from unread
    }
    };
    
  return (
    <Container className="mt-5">
          <h2>Reviews and Ratings</h2>
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
                  <Card.Title>{review.customer}</Card.Title>
                  <Card.Text>
                    <strong>Rating:</strong> {review.rating}/5
                  </Card.Text>
                  <Card.Text>
                    <strong>Feedback:</strong> {review.feedback}
                  </Card.Text>
                  <Form.Check 
                    type="checkbox" 
                            onChange={() => markReadReview(review.id)} //mark read checkbox
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
                  <Card.Title>{review.customer}</Card.Title>
                  <Card.Text>
                    <strong>Rating:</strong> {review.rating}/5
                  </Card.Text>
                  <Card.Text>
                    <strong>Feedback:</strong> {review.feedback}
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
