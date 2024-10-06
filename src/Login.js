import { useState } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./Login.css"; // Import CSS file for styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert("Logged in!");
        navigate("/business-input"); // Navigate to BusinessInput after successful login
      })
      .catch((error) => alert(error.message));
  };

  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(() => {
        alert("Logged in with Google!");
        navigate("/business-input"); // Navigate to BusinessInput after successful Google login
      })
      .catch((error) => alert(error.message));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="google-login-button">
        Login with Google
      </button>
      <p className="signup-prompt">
        Don't have an account?{" "}
        <span onClick={() => navigate("/signup")} className="signup-link">
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
