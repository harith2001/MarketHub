import React, { useState } from 'react'
import { Dropdown } from 'react-bootstrap';

const Notification = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, message: 'Order #1234 is awaiting shipment.' },
        { id: 2, message: 'You have a new message from Admin.' },
      ]);
  return (
    <Dropdown align="end">
        <i className="bi bi-bell-fill" style={{ fontSize: '1.5rem', color: '#a8a9aa' }}></i>
      <Dropdown.Menu>
        {notifications.length === 0 ? (
          <Dropdown.Item>No new notifications</Dropdown.Item>
        ) : (
          notifications.map((notification) => (
            <Dropdown.Item key={notification.id}>
              {notification.message}
            </Dropdown.Item>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default Notification