import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
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
        <Route path="*" element={<Home />} />
        <Route path="/auth" element={user ? <Navigate to="/home" /> : <AuthPage />} />
        <Route path="/events" element= {<Events />}/>
      </Routes>
    </Router>
  );
};

export default App;
