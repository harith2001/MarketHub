// UserContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a UserContext
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [vendorId, setVendorId] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, vendorId, setVendorId }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
