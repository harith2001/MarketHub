import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Button,
  Modal,
  Card,
  Container,
  Col,
} from "react-bootstrap";
import Header from "../Header";

const CustomerSupport = () => {
  // Initial inquiries data
  const [inquiries, setInquiries] = useState([
    {
      id: 1,
      customer: "John Doe",
      description: "Request for a refund on order #12345",
      date: "2024-09-12",
    },
    {
      id: 2,
      customer: "Jane Smith",
      description: "Complaint about late delivery",
      date: "2024-09-10",
    },
    {
      id: 3,
      customer: "Michael Brown",
      description: "Request for product exchange on order #54321",
      date: "2024-09-14",
    },
  ]);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeTab, setActiveTab] = useState("unresolved");

  // Handle clicking on resolve button
  const handleResolve = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowResolveModal(true);
  };

  // Confirm resolution
  const confirmResolve = () => {
    setInquiries(
      inquiries.map((inquiry) =>
        inquiry.id === selectedInquiry.id
          ? { ...inquiry, status: "Resolved" }
          : inquiry
      )
    );
    setShowResolveModal(false);
    setSelectedInquiry(null);
  };

  // Filter unresolved and resolved inquiries
  const unresolvedInquiries = inquiries.filter(
    (inquiry) => inquiry.status !== "Resolved"
  );
  const resolvedInquiries = inquiries.filter(
    (inquiry) => inquiry.status === "Resolved"
  );

  return (
    <Container  style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Customer Inquiries"></Header>
      <Tabs
        id="inquiry-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-3"
      >
        <Tab eventKey="unresolved" title="Unresolved Inquiries">
          {/* unresolved inquiries */}
          <div className="d-flex flex-wrap justify-content-start">
            {unresolvedInquiries.length === 0 ? (
              <p>No unresolved inquiries.</p>
            ) : (
              unresolvedInquiries.map((inquiry) => (
                <Col
                  md={12}
                  key={inquiry.id}
                  className="mb-3 shadow-sm"
                >
                  <Card className="bg-light">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title>{inquiry.customer}</Card.Title>
                      <Card.Text>
                        <strong>Issue:</strong> {inquiry.description}
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center">
                      <Card.Text>
                        <strong>Date:</strong> {inquiry.date}
                        </Card.Text>
                        <div>
                      <Button
                        variant="success"
                        onClick={() => handleResolve(inquiry)}
                        className="mt-auto align-self-end"
                        style={{
                          width: "100px",
                        }}
                      >
                        Resolve
                      </Button>

                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </div>
        </Tab>

        <Tab eventKey="resolved" title="Resolved Inquiries">
          {/* resolved inquiries */}
          <div className="d-flex flex-wrap justify-content-start">
            {resolvedInquiries.length === 0 ? (
              <p>No resolved inquiries yet.</p>
            ) : (
              resolvedInquiries.map((inquiry) => (
                <Col
                  md={12}
                  key={inquiry.id}
                  className="mb-3 shadow-sm"
                >
                  <Card className="bg-light">
                    <Card.Body>
                      <Card.Title>{inquiry.customer}</Card.Title>
                      <Card.Text>
                        <strong>Issue:</strong> {inquiry.description}
                      </Card.Text>
                      <Card.Text>
                        <strong>Date:</strong> {inquiry.date}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </div>
        </Tab>
      </Tabs>

      <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Resolution</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to mark the inquiry from{" "}
          {selectedInquiry?.customer} as resolved?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResolveModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmResolve}>
            Confirm Resolve
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerSupport;
