import React, { useState, useEffect } from 'react';
import { Table, Button, Badge, Container, Tab, Tabs, Toast, ToastContainer, Modal } from 'react-bootstrap';
import Header from '../../components/Header';
import { getUsers, updateUserStatus, deleteUser } from '../../api/user';
import { useSearch } from '../../SearchContext';

const ManageUsers = () => {
  const { searchTerm } = useSearch();
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [csrs, setCsrs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [key, setKey] = useState('vendors'); 
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null); // Action to perform
  const [selectedUserId, setSelectedUserId] = useState(null);

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

   const handleShowModal = (action, userId) => {
    setCurrentAction(action);
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAction(null);
    setSelectedUserId(null);
  };

  const confirmAction = async () => {
    try {
      if (currentAction === 'deactivate') {
        await updateUserStatus(selectedUserId, false);
        const updatedUsers = users.map(user =>
          user.user_ID === selectedUserId ? { ...user, isActive: false } : user
        );
        setUsers(updatedUsers);
        setToastMessage('User deactivated successfully!');
      } else if (currentAction === 'activate') {
        await updateUserStatus(selectedUserId, true);
        const updatedUsers = users.map(user =>
          user.user_ID === selectedUserId ? { ...user, isActive: true } : user
        );
        setUsers(updatedUsers);
        setToastMessage('User activated successfully!');
      } else if (currentAction === 'remove') {
        await deleteUser(selectedUserId);
        const updatedUsers = users.filter(user => user.user_ID !== selectedUserId);
        setUsers(updatedUsers);
        setToastMessage('User removed successfully!');
      }
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Failed to perform action:', error);
    } finally {
      handleCloseModal();
    }
  };

  // Filter users based on search term
  const filteredVendors = vendors.filter(user =>
    user.user_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCsrs = csrs.filter(user =>
    user.user_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter(user =>
    user.user_ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                {filteredVendors.map(user => (
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
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('deactivate', user.user_ID)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          className="me-2 btn-success"
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('activate', user.user_ID)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px" }}
                        onClick={() => handleShowModal('remove', user.user_ID)}
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
                {filteredCsrs.map(user => (
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
                      {user.isActive ? (
                        <Button
                          className="me-2 btn-warning"
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('deactivate', user.user_ID)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          className="me-2 btn-success"
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('activate', user.user_ID)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px" }}
                        onClick={() => handleShowModal('remove', user.user_ID)}
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
          {customers.length === 0 ? (
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
                {filteredCustomers.map(user => (
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
                      {user.isActive ? (
                        <Button
                          className="me-2 btn-warning"
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('deactivate', user.user_ID)}
                        >
                          Deactivate
                        </Button>
                      ) : (
                        <Button
                          className="me-2 btn-success"
                          style={{ width: "100px" }}
                          onClick={() => handleShowModal('activate', user.user_ID)}
                        >
                          Activate
                        </Button>
                      )}
                      <Button
                        className="btn-danger"
                        style={{ width: "100px" }}
                        onClick={() => handleShowModal('remove', user.user_ID)}
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

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAction === 'remove' ? 'Confirm Removal' : 'Confirm Action'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentAction === 'remove' ? (
            <p>Are you sure you want to remove this user?</p>
          ) : (
            <p>Are you sure you want to {currentAction} this user?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmAction}>
            {currentAction === 'remove' ? 'Remove' : currentAction === 'deactivate' ? 'Deactivate' : 'Activate'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageUsers;
