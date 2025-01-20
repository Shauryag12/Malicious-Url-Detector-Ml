import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import MainPage from "./pages/MainPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Blog from "./pages/Blog";
import About from "./pages/About";

// Import components
import Header from "./components/Header";

/**
 * App.js:
 * - Sets up React Router.
 * - Renders a global Header for site-wide navigation.
 * - Defines routes for MainPage, SignIn, SignUp, Blog, and About.
 */
function App() {
  return (
    <Router>
      {/* Header is rendered on all pages */}

      {/* Define the routes for the application */}
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/about" element={<About />} />
        {/* Fallback route for any unknown URL */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
