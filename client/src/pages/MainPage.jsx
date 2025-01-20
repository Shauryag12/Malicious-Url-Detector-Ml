import React, { useRef, useState } from "react";
import "./MainPage.css";

/**
 * MainPage:
 * - Hero section with background + overlay, large text.
 * - "Get Started" button that scrolls to the URL checker section.
 * - URL checker with a 6-second staged loader (progress bar & messages).
 * - Four info sections with images, alternating layout.
 * - Minimal, modern footer.
 */
function MainPage() {
  const checkerRef = useRef(null);

  const handleGetStartedClick = () => {
    checkerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="main-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Protect Your World from Malicious URLs</h1>
          <p className="hero-subtitle">Minimalistic. Modern. Powerful.</p>
          <button className="btn btn-hero" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </section>

      {/* URL CHECKER SECTION (80vh) */}
      <section className="checker-section" ref={checkerRef}>
        <UrlChecker />
      </section>

      {/* INFO SECTIONS (same as before) */}
      <section className="info-section odd-layout">
        <div className="info-content">
          <div className="info-text">
            <h2>What is a Malicious URL?</h2>
            <p>
              A malicious URL is a link designed to either download malicious
              software, steal personal information, or otherwise harm the user’s
              device or data. Attackers often mask such links using shorteners
              or misleading text.
            </p>
          </div>
          <div className="info-image">
            <img
              src="https://images.unsplash.com/photo-1536104968052-1fa2d2f2c719?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Malicious Link Illustration"
            />
          </div>
        </div>
      </section>

      <section className="info-section even-layout">
        <div className="info-content">
          <div className="info-text">
            <h2>How Our AI Helps</h2>
            <p>
              Our AI-powered engine inspects each URL in real-time, analyzing
              potential threats by comparing known malicious signatures and
              emerging patterns across the internet.
            </p>
          </div>
          <div className="info-image">
            <img
              src="https://images.unsplash.com/photo-1638456927181-d7d3dfa13892?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="AI Analysis"
            />
          </div>
        </div>
      </section>

      <section className="info-section odd-layout">
        <div className="info-content">
          <div className="info-text">
            <h2>Why Use a URL Checker?</h2>
            <p>
              In today’s digital landscape, even the most savvy users can be
              tricked by cleverly disguised phishing sites. A URL checker adds
              an extra layer of security to your daily browsing.
            </p>
          </div>
          <div className="info-image">
            <img
              src="https://images.unsplash.com/photo-1544194215-541c2d35646a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Security Shield"
            />
          </div>
        </div>
      </section>

      <section className="info-section even-layout">
        <div className="info-content">
          <div className="info-text">
            <h2>We’ve Got You Covered</h2>
            <p>
              Whether you’re on a desktop at work or on your phone at home, our
              URL-checking solution seamlessly integrates and keeps you safe.
              Our intuitive interface and real-time scanning give you peace of
              mind.
            </p>
          </div>
          <div className="info-image">
            <img
              src="https://images.unsplash.com/photo-1555617117-08f3f4901ef4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Device Integration"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section">
        <p>
          &copy; {new Date().getFullYear()} MaliciousURL.io — All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}

/**
 * UrlChecker Component:
 * - Renders an input for the user to type in a URL.
 * - On "Check" click or Enter, runs a 6-second staged progress:
 *   0-2s -> "Acquiring URL..."
 *   2-4s -> "Scanning URL..."
 *   4-6s -> "Checking with the AI..."
 * - Once progress hits 100% at 6s, reveals a random "OK" or "Malicious" verdict.
 */
function UrlChecker() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [progressMessage, setProgressMessage] = useState("");
  const [verdict, setVerdict] = useState(null);

  const handleCheckUrl = () => {
    if (!url.trim()) return;

    // Reset states
    setProgress(0);
    setIsLoading(true);
    setProgress(33);
    setProgressMessage("Acquiring URL...");
    setVerdict(null);

    // We'll simulate a 6-second total loading time with 3 message stages
    // 0s -> 2s: "Acquiring URL..." (progress 0 -> 33)
    // 2s -> 4s: "Scanning URL..." (progress 33 -> 66)
    // 4s -> 6s: "Checking with the AI..." (progress 66 -> 100)
    // then reveal verdict at 6s
    setTimeout(() => {
      setProgress(66);
      setProgressMessage("Scanning URL...");
    }, 2000);

    setTimeout(() => {
      setProgress(100);
      setProgressMessage("Checking with the AI...");
    }, 4000);

    setTimeout(() => {
      setProgress(100);
    }, 6000);

    // Finally, reveal verdict after 6 seconds
    setTimeout(() => {
      const randomResult = Math.random() < 0.5 ? "ok" : "malicious";
      setVerdict(randomResult);
      setIsLoading(false);
    }, 6000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCheckUrl();
    }
  };

  return (
    <div className="checker-container">
      <h2>Check a URL</h2>

      {/* URL input + button */}
      <div className={`url-input-wrapper ${isLoading ? "loading" : ""}`}>
        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={handleCheckUrl} disabled={isLoading}>
          Check
        </button>
      </div>

      {/* PROGRESS BAR (only show if isLoading or progress < 100) */}
      {(isLoading || progress < 100) && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="progress-message">{progressMessage}</p>
        </div>
      )}

      {/* VERDICT MESSAGES */}
      {verdict === "ok" && (
        <div className="verdict verdict-ok">
          <p>
            This URL appears to be <strong>Safe</strong>.
          </p>
        </div>
      )}
      {verdict === "malicious" && (
        <div className="verdict verdict-malicious">
          <p>
            Warning! This URL may be <strong>Malicious</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

export default MainPage;
