import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Signup.css";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // New state for success message
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const usersRef = collection(db, "users");

            // Check if username exists
            const qUsername = query(usersRef, where("username", "==", username));
            const usernameSnapshot = await getDocs(qUsername);
            if (!usernameSnapshot.empty) {
                setError("Username is already taken. Please choose another one.");
                return;
            }

            // Check if email exists
            const qEmail = query(usersRef, where("email", "==", email));
            const emailSnapshot = await getDocs(qEmail);
            if (!emailSnapshot.empty) {
                setError("Email is already in use. Try logging in.");
                return;
            }

            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user details in Firestore
            await addDoc(usersRef, {
                uid: user.uid,
                username,
                email
            });

            // Show success message & redirect to login
            setSuccess("Signup successful! Redirecting to login...");
            setTimeout(() => {
                navigate("/auth?mode=login");
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-card">
                <h2 className="signup-title">Create an Account</h2>
                <p className="signup-subtitle">Join us and start exploring!</p>

                {error && <p className="signup-error">{error}</p>}
                {success && <p className="signup-success">{success}</p>} {/* Show success message */}

                <form onSubmit={handleSignup} className="signup-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="signup-button">Sign Up</button>
                </form>

                <p className="signup-toggle">
                    Already have an account? <Link to="/auth?mode=login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
