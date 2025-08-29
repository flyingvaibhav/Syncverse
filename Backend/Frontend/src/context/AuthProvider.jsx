import React, { createContext, useContext, useState } from "react";
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  // Only persist the user object in localStorage under key "ChatApp".
  // The jwt cookie is used by the backend only and is NOT JSON; don't parse it.
  let parsedUser = null;
  const stored = typeof window !== "undefined" ? localStorage.getItem("ChatApp") : null;
  if (stored) {
    try {
      parsedUser = JSON.parse(stored);
    } catch (_e) {
      parsedUser = null;
    }
  }

  const [authUser, setAuthUser] = useState(parsedUser);
  return (
    <AuthContext.Provider value={[authUser, setAuthUser]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);