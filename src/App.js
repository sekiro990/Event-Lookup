import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import AuthPage from "./Pages/AuthPage";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Events from "./Components/Events";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        {/* Set proper route path for Home */}
        <Route path="/" element={<Home />} />

        {/* Protect Events Route - Only logged-in users can access */}
        <Route
          path="/events"
          element={user ? <Events /> : <Navigate to="/auth" />}
        />

        {/* Auth route, redirect if already logged in */}
        <Route
          path="/auth"
          element={user ? <Navigate to="/" /> : <AuthPage />}
        />

        {/* Catch-all for unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
