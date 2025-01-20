import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * SignIn Page:
 * - Minimal design with fields for email, password.
 * - A "Sign In" button and link to "Sign Up".
 */
function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e) => {
    e.preventDefault();
    // Placeholder: You can handle sign-in logic here
    alert(`Signing in with:\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div className="container" style={styles.signInContainer}>
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn} style={styles.form}>
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
          Sign In
        </button>
      </form>
      <p style={styles.switchLink}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

const styles = {
  signInContainer: {
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

export default SignIn;
