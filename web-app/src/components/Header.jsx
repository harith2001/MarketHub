import React, { useState } from 'react';
import { InputGroup, FormControl, Button, Nav, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Notification from './vendor/Notification'; // Adjust path if necessary

const Header = ({ title }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  return (
      <div className="d-flex justify-content-between py-3">
          <h3 className="m-0">{title}</h3>
      <div className="d-flex align-items-center flex-nowrap">
        <InputGroup className="me-3" style={{ maxWidth: '250px' }}>
          <FormControl
            placeholder="Search"
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <InputGroup.Text>
            <i className="bi bi-search" style={{ color: '#a8a9aa' }}></i>
          </InputGroup.Text>
        </InputGroup>

        <InputGroup className="me-3" style={{ maxWidth: '250px' }}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="form-control"
          />
                  <InputGroup.Text>
            <i className="bi bi-calendar-fill" style={{ color: '#a8a9aa'}}></i>
                  </InputGroup.Text>
        </InputGroup>

        <div className="me-3 d-flex align-items-center justify-content-center" style={{ border: '1px solid #ced4da', 
          padding: '2px 6px', 
          borderRadius: '5px',
          color: '#a8a9aa'}}>
          <Notification />
        </div>

        <Nav.Link className="d-flex align-items-center justify-content-center" style={{
          border: '1px solid #ced4da', 
          padding: '2px 6px', 
          borderRadius: '5px',
          color: '#a8a9aa'
        }}>
          <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
        </Nav.Link>
      </div>
    </div>
  );
};

export default Header;
