import { useLocation, useNavigate } from "react-router-dom";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = new URLSearchParams(location.search).get("mode") === "login";

    return (
        <div>
            {/* Login/Signup Form */}
            {isLogin ? <Login /> : <Signup />}

            {/* Toggle Between Login & Signup */}
            <p>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => navigate(`/auth?mode=${isLogin ? "signup" : "login"}`)}>
                    {isLogin ? "Sign up" : "Log in"}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;
