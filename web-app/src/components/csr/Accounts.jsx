import React, { useState, useEffect } from "react";
import { Table, Button, Card, Tabs, Tab, Modal, Toast, ToastContainer } from "react-bootstrap";
import Header from "../Header";
import { getUsers, updateUserStatus, deleteUser } from "../../api/user";
import { useSearch } from "../../SearchContext";

const Accounts = () => {
  const { searchTerm } = useSearch();
  const [approvedAccounts, setApprovedAccounts] = useState([]);
  const [deactivatedAccounts, setDeactivatedAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState(null); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    fetchUsers(); // Fetch users when component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getUsers(); // Fetch all users from API
      const customers = users.filter(user => user.role === "Customer"); // Filter customers

      // Categorize users into approved and deactivated
      const approved = customers.filter(user => user.isActive);
      const deactivated = customers.filter(user => !user.isActive);

      setApprovedAccounts(approved);
      setDeactivatedAccounts(deactivated);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Handle Deactivate, Reactivate, Delete
  const handleConfirmAction = async () => {
    try {
      if (action === "Deactivate") {
        await updateUserStatus(selectedAccount.user_ID, false); // Deactivate user
        setApprovedAccounts(
          approvedAccounts.filter((account) => account.user_ID !== selectedAccount.user_ID)
        );
        setDeactivatedAccounts([...deactivatedAccounts, { ...selectedAccount, isActive: false }]);
        setToastMessage('User deactivated successfully!');
      } else if (action === "Reactivate") {
        await updateUserStatus(selectedAccount.user_ID, true); // Reactivate user
        setDeactivatedAccounts(
          deactivatedAccounts.filter(
            (account) => account.user_ID !== selectedAccount.user_ID
          )
        );
        setApprovedAccounts([...approvedAccounts, { ...selectedAccount, isActive: true }]);
        setToastMessage('User reactivated successfully!');
      } else if (action === "Delete") {
        await deleteUser(selectedAccount.user_ID); // Delete user
        setApprovedAccounts(
          approvedAccounts.filter((account) => account.user_ID !== selectedAccount.user_ID)
        );
        setToastMessage('User deleted successfully!');
      }

      setShowModal(false);
    } catch (error) {
      console.error(`Error during ${action}:`, error);
    }
  };

  // Filter approved accounts based on search term
  const filteredApprovedAccounts = approvedAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter deactivated accounts based on search term
  const filteredDeactivatedAccounts = deactivatedAccounts.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open confirmation modal
  const handleAction = (action, account) => {
    setAction(action);
    setSelectedAccount(account);
    setShowModal(true);
  };

  return (
      <div style={{ marginLeft: "200px", padding: "20px" }}>
          <Header title="User Accounts"></Header>
      <Tabs defaultActiveKey="approved" className="mb-4">

        {/* Approved Accounts Tab */}
        <Tab eventKey="approved" title={`Approved (${approvedAccounts.length})`}>
              {/* Approved Accounts Table */}
              {filteredApprovedAccounts.length === 0 ? (
                <p>No approved accounts found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Creation Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApprovedAccounts.map((account) => (
                      <tr key={account.user_ID}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            style={{ width: "100px" }}
                            variant="warning"
                            size="sm"
                            onClick={() => handleAction("Deactivate", account)}
                            className="me-2"
                          >
                            Deactivate
                          </Button>
                          <Button
                            variant="danger"
                            style={{width: "100px"}}
                            size="sm"
                            onClick={() => handleAction("Delete", account)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
        </Tab>

        {/* Deactivated Accounts Tab */}
        <Tab eventKey="deactivated" title={`Deactivated (${deactivatedAccounts.length})`}>
              {/* Deactivated Accounts Table */}
              {filteredDeactivatedAccounts.length === 0 ? (
                <p>No deactivated accounts found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Creation Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeactivatedAccounts.map((account) => (
                      <tr key={account.user_ID}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{new Date(account.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Button
                            variant="primary"
                            style={{width: "100px"}}
                            size="sm"
                            onClick={() => handleAction("Reactivate", account)}
                          >
                            Reactivate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
        </Tab>
      </Tabs>

      {/* Modal confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className="mt-5">
        <Modal.Header closeButton>
          <Modal.Title>Confirm {action}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {action} {selectedAccount?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast for notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} bg={toastType === 'success' ? 'success' : 'danger'}>
          <Toast.Header>
            <strong className="me-auto">{toastType === 'success' ? 'Success' : 'Error'}</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default Accounts;
