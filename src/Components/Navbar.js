import React, { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../Styles/Navbar.css"; // Ensure the correct path

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Check auth state
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="Navbar">
            {/* Desktop Navigation */}
            <ul className="nav-links">
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/events">Events</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
            </ul>

            {/* Mobile Menu & Login */}
            <div className="menu-container">
                {!user ? (
                    <Link to="/auth?mode=login" className="login-btn">
                        Login / Signup
                    </Link>
                ) : (
                    <button onClick={handleLogout} className="login-btn">
                        Logout
                    </button>
                )}
                <button onClick={toggleMenu} className="menu-btn">
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="mobile-menu">
                    <button onClick={closeMenu} className="close-btn">
                        <FiX />
                    </button>
                    <ul>
                        <li onClick={closeMenu}><Link to="/home">Home</Link></li>
                        <li onClick={closeMenu}><Link to="/events">Events</Link></li>
                        <li onClick={closeMenu}><Link to="/about">About</Link></li>
                        <li onClick={closeMenu}><Link to="/contact">Contact Us</Link></li>
                        {!user ? (
                            <li onClick={closeMenu}>
                                <Link to="/auth?mode=login">Login / Signup</Link>
                            </li>
                        ) : (
                            <li onClick={handleLogout}>Logout</li>
                        )}
                    </ul>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
