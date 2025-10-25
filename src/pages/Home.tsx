import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Brain, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Discover Your Perfect Engineering Path</h1>
          <p>
            {" "}
            College recommendations for Maharashtra's top engineering
            institutions. Find your ideal match based on your profile,
            preferences, and career goals.
          </p>
          <div className="hero-buttons">
            <Link to="/college-finder" className="btn btn-primary hero-btn">
              Find Colleges
            </Link>
            <Link to="/branch-quiz" className="btn btn-secondary hero-btn">
              Discover Branch
            </Link>
            <a
              href="https://chat.whatsapp.com/EfIsHoMdJRhKA5xCTlGfpB"
              className="btn btn-success hero-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Community
            </a>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <Search size={40} />
            </div>
            <h3 className="feature-title">Smart College Finder</h3>
            <p className="feature-description">
              Our advanced algorithm analyzes your MHT-CET percentile, category,
              and preferred location to recommend the most suitable engineering
              colleges with high accuracy.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Brain size={40} />
            </div>
            <h3 className="feature-title">Branch Discovery Quiz</h3>
            <p className="feature-description">
              Unsure about your engineering specialization? Take our
              comprehensive quiz to discover the perfect branch that aligns with
              your interests and aptitude.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Users size={40} />
            </div>
            <h3 className="feature-title">Student Community</h3>
            <p className="feature-description">
              Connect with thousands of engineering aspirants across
              Maharashtra. Share experiences, get guidance, and build meaningful
              connections.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Collegify
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.1rem",
                marginBottom: "1rem",
              }}
            >
              Empowering Engineering Dreams Across Maharashtra
            </p>
            <p style={{ color: "var(--text-muted)" }}>
              © 2025 Collegify. All rights reserved.
            </p>
            <div className="designed-by"></div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: rgba(10, 10, 26, 0.9);
          backdrop-filter: blur(20px);
          color: var(--text-secondary);
          text-align: center;
          padding: 3rem 0;
          margin-top: 6rem;
          border-top: 1px solid var(--glass-border);
        }

        .footer h3 {
          color: var(--text-primary);
          font-family: "Space Grotesk", sans-serif;
        }

        .designed-by {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 1.1rem;
          font-weight: 600;
          background: var(--primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </>
  );
};

export default Home;