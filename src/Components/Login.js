import { useState } from "react";
import { auth, googleProvider, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import '../Styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                alert(`Login successful! Welcome, ${userData.username}!`);
            } else {
                alert("Login successful!");
            }
        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await addDoc(usersRef, {
                    uid: user.uid,
                    username: user.displayName,
                    email: user.email
                });
            }
            alert(`Login successful! Welcome, ${user.displayName}!`);
        } catch (error) {
            setError("Google Sign-In failed. Try again.");
            console.error("Google Sign-In Error:", error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Please login to continue</p>

                {error && <p className="login-error">{error}</p>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">Login</button>
                </form>

                <hr className="divider" />

                <button className="google-button" onClick={handleGoogleLogin}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="google-icon" />
                    Continue with Google
                </button>

                <p className="login-toggle">
                    Don't have an account? <a href="/auth?mode=signup">Sign up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
