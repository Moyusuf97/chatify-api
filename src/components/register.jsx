import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const RegistrationForm = ({ csrfToken }) => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const registrationData = {
      ...user,
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Username or email already exists");
        }
        localStorage.setItem("username", user.username);
        localStorage.setItem("email", user.email);
        navigate("/login", { state: { message: "Registration successful" } });
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Create Account</h1>
        {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}
        <p className="text-center">
          Are you a member?{" "}
          <NavLink to="/login" className="text-primary">
            Log In
          </NavLink>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={user.username}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={user.password}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={user.email}
              onChange={handleInputChange}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
