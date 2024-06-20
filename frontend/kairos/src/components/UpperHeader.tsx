import React from 'react';
import LocationFinder from './LocationFinder';
import { Container, Row, Col } from 'react-bootstrap';

const UpperHeader = () => {
  return (
    <Container fluid className="bg-light py-2">
      <Row>
        <Col className="text-center">
          <LocationFinder />
        </Col>
      </Row>
    </Container>
  );
};

export default UpperHeader;
