import React from "react";

/**
 * About Page (or Contact):
 * - Demonstrates how additional pages can follow the same minimal design.
 * - Feel free to rename this component to "Contact" or anything else.
 */
function About() {
  return (
    <div className="container" style={styles.aboutContainer}>
      <h2>About Us</h2>
      <p style={styles.aboutText}>
        We believe in keeping the internet safe and secure. Our mission is to
        empower users with intuitive tools for detecting and avoiding malicious
        URLs.
      </p>
      <p style={styles.aboutText}>
        Our platform is designed to be simple yet powerful, offering real-time
        detection that fits seamlessly into your workflow.
      </p>
    </div>
  );
}

const styles = {
  aboutContainer: {
    margin: "4rem auto",
    textAlign: "center",
  },
  aboutText: {
    maxWidth: "600px",
    margin: "1rem auto",
    fontSize: "1.1rem",
    lineHeight: 1.6,
    color: "#555",
  },
};

export default About;
