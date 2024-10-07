import React, { useState } from "react";
import { Table, Button, Card, Tabs, Tab, Modal } from "react-bootstrap";
import Header from "../Header";

const Accounts = () => {
  const [pendingAccounts, setPendingAccounts] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@gmail.com",
      requestDate: "05-10-2024",
      status: "Pending Activation",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@gmail.com",
      requestDate: "05-10-2024",
      status: "Pending Activation",
    },
  ]);

  const [approvedAccounts, setApprovedAccounts] = useState([
    {
      id: 3,
      name: "Alex Brown",
      email: "alex@gmail.com",
      requestDate: "05-10-2024",
      status: "Approved",
    },
  ]);

  const [deactivatedAccounts, setDeactivatedAccounts] = useState([
    {
      id: 4,
      name: "Michael Johnson",
      email: "michael@gmail.com",
      requestDate: "05-10-2024",
      status: "Deactivated",
    },
  ]);

  const [showModal, setShowModal] = useState(false); // Modal for confirmation
  const [modalAction, setModalAction] = useState(null); // Action type for the modal
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Open confirmation modal
  const handleAction = (action, account) => {
    setModalAction(action);
    setSelectedAccount(account);
    setShowModal(true);
  };

  // Confirm action from modal
  const handleConfirmAction = () => {
    if (modalAction === "Deactivate") {
      // Move user from Approved to Deactivated
      setApprovedAccounts(
        approvedAccounts.filter((account) => account.id !== selectedAccount.id)
      );
      setDeactivatedAccounts([...deactivatedAccounts, selectedAccount]);
    } else if (modalAction === "Delete") {
      // Remove user from Approved
      setApprovedAccounts(
        approvedAccounts.filter((account) => account.id !== selectedAccount.id)
      );
    } else if (modalAction === "Reactivate") {
      // Move user from Deactivated to Approved
      setDeactivatedAccounts(
        deactivatedAccounts.filter(
          (account) => account.id !== selectedAccount.id
        )
      );
      setApprovedAccounts([...approvedAccounts, selectedAccount]);
    }

    setShowModal(false);
  };

  // Approve user from pending accounts
  const handleApprove = (id) => {
    const accountToApprove = pendingAccounts.find(
      (account) => account.id === id
    );
    setPendingAccounts(pendingAccounts.filter((account) => account.id !== id));
    setApprovedAccounts([
      ...approvedAccounts,
      { ...accountToApprove, status: "Approved" },
    ]);
  };

  return (
      <div style={{ marginLeft: "200px", padding: "20px" }}>
          <Header title="Accounts"></Header>
      <Tabs defaultActiveKey="requests" className="mb-4">
        {/* Pending Requests Tab */}
        <Tab eventKey="requests" title="Requests">
              {/* Pending Accounts Table */}
              {pendingAccounts.length === 0 ? (
                <p>No pending account requests found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Request Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{account.requestDate}</td>
                        <td>
                          <Button
                            variant="success"
                            style={{width: "100px"}}
                            size="sm"
                            onClick={() => handleApprove(account.id)}
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
        </Tab>

        {/* Approved Accounts Tab */}
        <Tab eventKey="approved" title="Approved">
              {/* Approved Accounts Table */}
              {approvedAccounts.length === 0 ? (
                <p>No approved accounts found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Approved Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{account.requestDate}</td>
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
        <Tab eventKey="deactivated" title="Deactivated">
              {/* Deactivated Accounts Table */}
              {deactivatedAccounts.length === 0 ? (
                <p>No deactivated accounts found.</p>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email</th>
                      <th>Deactivation Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deactivatedAccounts.map((account) => (
                      <tr key={account.id}>
                        <td>{account.name}</td>
                        <td>{account.email}</td>
                        <td>{account.requestDate}</td>
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

      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {modalAction}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {modalAction} {selectedAccount?.name}?
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
    </div>
  );
};

export default Accounts;
