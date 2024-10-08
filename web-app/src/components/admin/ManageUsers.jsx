import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Tab, Tabs } from 'react-bootstrap';
import Header from '../../components/Header';
import { getUsers } from '../../api/user';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [csrs, setCsrs] = useState([]);
  const [key, setKey] = useState('vendors'); 

  // Fetch all users and separate Vendors and CSRs and Customers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        
        // Separate vendors and CSRs
        const vendorList = fetchedUsers.filter(user => user.role === 'Vendor');
        const csrList = fetchedUsers.filter(user => user.role === 'CSR');
        setVendors(vendorList);
        setCsrs(csrList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeactivate = (userId) => {
    const updatedUsers = users.map(user =>
      user.user_ID === userId ? { ...user, isActive: false } : user
    );
    setUsers(updatedUsers);
  };

  const handleActivate = (userId) => {
    const updatedUsers = users.map(user =>
      user.user_ID === userId ? { ...user, isActive: true } : user
    );
    setUsers(updatedUsers);
  };

  const handleRemove = (userId) => {
    const updatedUsers = users.filter(user => user.user_ID !== userId);
    setUsers(updatedUsers);
  };

  return (
    <Container style={{ marginLeft: "200px", padding: "20px" }}>
      <Header title="Users"></Header>
      <Tabs
        id="user-management-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="vendors" title={`Vendors (${vendors.length})`}>
          {vendors.length === 0 ? (
            <p>No vendors found.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map(user => (
                  <tr key={user.user_ID}>
                    <td>{user.user_ID}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.isActive ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>
                      {user.isActive ? (
                        <Button
                          className="me-2 btn-warning"
                          style={{ width: "100px"}}
                          onClick={() => handleDeactivate(user.id)}
                          
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                            className="me-2 btn-success"
                            style={{ width: "100px"}}
                          onClick={() => handleActivate(user.id)}
                          
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px"}}
                        onClick={() => handleRemove(user.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        <Tab eventKey="csrs" title={`CSRs (${csrs.length})`}>
          {csrs.length === 0 ? (
            <p>No CSRs found.</p>
          ) : (
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {csrs.map(user => (
                  <tr key={user.user_ID}>
                    <td>{user.user_ID}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.status === 'Active' ? (
                        <Badge bg="success">Active</Badge>
                      ) : (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>
                      {user.status === 'Active' ? (
                        <Button
                          className="me-2 btn-warning"
                          style={{ width: "100px"}}
                          onClick={() => handleDeactivate(user.id)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                            className="me-2 btn-success"
                            style={{ width: "100px"}}
                          onClick={() => handleActivate(user.id)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px"}}
                        onClick={() => handleRemove(user.id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ManageUsers;
