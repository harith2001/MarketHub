import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Tab, Tabs, Toast, ToastContainer } from 'react-bootstrap';
import Header from '../../components/Header';
import { getUsers, updateUserStatus, deleteUser } from '../../api/user';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [csrs, setCsrs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [key, setKey] = useState('vendors'); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch all users and separate Vendors and CSRs and Customers
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
        
        // Separate vendors CSRs Customers
        const vendorList = fetchedUsers.filter(user => user.role === 'Vendor');
        const csrList = fetchedUsers.filter(user => user.role === 'CSR');
        const customerList = fetchedUsers.filter(user => user.role === 'Customer');
        setVendors(vendorList);
        setCsrs(csrList);
        setCustomers(customerList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeactivate = async (userId) => {
    try {
      console.log("deactivating user:", userId);
      await updateUserStatus(userId, "false"); // Call the function to deactivate
      const updatedUsers = users.map(user =>
        user.user_ID === userId ? { ...user, isActive: "false" } : user
      );
      setUsers(updatedUsers);

      // toast messages
      setToastMessage('User deactivated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleActivate = async (userId) => {
    try {
      console.log("Activating user:", userId);
      await updateUserStatus(userId, "true"); // Call the function to activate
      const updatedUsers = users.map(user =>
        user.user_ID === userId ? { ...user, isActive: "true" } : user
      );
      setUsers(updatedUsers);

      // toast messages
      setToastMessage('User activated successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await deleteUser(userId); // Call the function to delete the user
      const updatedUsers = users.filter(user => user.user_ID !== userId);
      setUsers(updatedUsers); // Update the local state to remove the user

      // toast message
      setToastMessage('User removed successfully!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to remove user:', error);
    }
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
                          onClick={() => handleDeactivate(user.user_ID)}
                          
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                            className="me-2 btn-success"
                            style={{ width: "100px"}}
                          onClick={() => handleActivate(user.user_ID)}
                          
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px"}}
                        onClick={() => handleRemove(user.user_ID)}
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

        <Tab eventKey="customers" title={`Customers (${customers.length})`}>
          {csrs.length === 0 ? (
            <p>No Customers found.</p>
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
                {customers.map(user => (
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

      {/* Toast for notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastType === 'success' ? 'success' : 'danger'}>
          <Toast.Header>
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default ManageUsers;
