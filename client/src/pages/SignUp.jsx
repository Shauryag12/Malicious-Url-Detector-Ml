import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * SignUp Page:
 * - Fields for name, email, password.
 * - A "Sign Up" button and link to "Sign In".
 */
function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = (e) => {
    e.preventDefault();
    // Placeholder: You can handle sign-up logic here
    alert(
      `Signing up with:\nName: ${name}\nEmail: ${email}\nPassword: ${password}`
    );
  };

  return (
    <div className="container" style={styles.signUpContainer}>
      <h2>Create Account</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <input
          type="text"
          placeholder="Name"
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Sign Up
        </button>
      </form>
      <p style={styles.switchLink}>
        Already have an account? <Link to="/signin">Sign In</Link>
      </p>
    </div>
  );
}

const styles = {
  signUpContainer: {
    maxWidth: "400px",
    margin: "4rem auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
  },
  input: {
    padding: "0.75rem",
    margin: "0.5rem 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  switchLink: {
    marginTop: "1rem",
  },
};

export default SignUp;
