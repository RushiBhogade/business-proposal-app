// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS for the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/business-input">Home</Link>
        </li>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/chat">Real-Time Chat</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
