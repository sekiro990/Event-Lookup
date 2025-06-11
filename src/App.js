import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Pages/Home";
import AuthPage from "./Pages/AuthPage";
import Events from "./Components/Events";
import EventDetailPage from "./Components/EventDetails"; // ✅ Correct import

import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

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
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />

        {/* Protected Routes */}
        <Route path="/events" element={user ? <Events /> : <Navigate to="/auth" />} />
        <Route path="/events/:id" element={user ? <EventDetailPage /> : <Navigate to="/auth" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
