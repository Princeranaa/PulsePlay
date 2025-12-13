import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    userType: "user",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      password: form.password,
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
    };

    console.log("Payload to be sent:", payload);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        payload,
        { withCredentials: true }
      );

      navigate("/");
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Create an Account</h1>
          <p>Join Piper for free to listen to unlimited music.</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {/* --- NEW: User Type Radio Buttons --- */}
          <div className="radio-group-container">
            <label className="radio-label-main">I am registering as:</label>
            <div className="radio-options-row">
              <div className="radio-option">
                <input
                  type="radio"
                  id="userTypeUser"
                  name="userType"
                  value="user"
                  onChange={handleChange}
                  defaultChecked
                />
                <label htmlFor="userTypeUser">User</label>
              </div>
              <div className="radio-option">
                <input
                  type="radio"
                  id="userTypeArtist"
                  name="userType"
                  value="artist"
                  onChange={handleChange}
                />
                <label htmlFor="userTypeArtist">Artist</label>
              </div>
            </div>
          </div>
          {/* ------------------------------------ */}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstname">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                placeholder="John"
                required
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                placeholder="Doe"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john@example.com"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>

        <div className="divider">
          <span>or continue with</span>
        </div>

        <button
          onClick={() => {
            window.location.href = "http://localhost:3000/api/auth/google";
          }}
          type="button"
          className="btn-google"
        >
          <svg
            className="google-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="register-footer">
          <p>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
