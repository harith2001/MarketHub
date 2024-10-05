import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../../components/csr/Sidebar";
import MainContent from "../../components/csr/MainContent";

const CSRDashboard = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={3} md={2} className="bg-light">
          <Sidebar />
        </Col>

        <Col xs={9} md={10} className="p-4">
          <MainContent />
        </Col>
      </Row>
    </Container>
  );
};

export default CSRDashboard;
