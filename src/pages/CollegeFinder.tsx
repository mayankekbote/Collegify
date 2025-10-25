import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Star,
} from "lucide-react";
import { collegeAPI, College, CollegeSearchParams } from "../utils/api";

// Small, self-contained carousel used only in this page.
const Carousel: React.FC<{ images: string[]; altPrefix?: string }> = ({
  images,
  altPrefix,
}) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images]);

  const current = images && images.length > 0 ? images[idx] : undefined;

  return (
    <div style={{ position: "relative", width: "100%", height: 220 }}>
      {current && (
        <img
          src={current}
          alt={`${altPrefix || "image"} ${idx + 1}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400";
          }}
        />
      )}

      {/* indicators */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 6,
        }}
      >
        {images.map((_, i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i === idx ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)",
              display: "inline-block",
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CollegeFinder: React.FC = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useState<CollegeSearchParams>({
    percentile: 0,
    category: "Open",
    region: "",
    branch: "",
  });

  const categories = ["Open", "SC", "ST", "OBC"];
  const regions = [
    "Mumbai University",
    "Pune University",
    "Nagpur University",
    "Other",
  ];
  const branches = [
    "Computer Engg.",
    "Information Technology",
    "Mechanical Engg.",
    "Electronics and Telecommunication Engg.",
    "Civil Engg.",
    "Electrical  Engg.",
    "ECS",
  ];

  const handleSearch = async () => {
    if (searchParams.percentile <= 0) {
      setError("Please enter a valid percentile");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await collegeAPI.search(searchParams);
      setColleges(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to search colleges");
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchPercentage = (college: College): number => {
    let score = 0;

    // Cutoff match (40% weight)
    if (searchParams.percentile >= college.cutoff_percentile) {
      score += 40;
    } else {
      const deficit = college.cutoff_percentile - searchParams.percentile;
      score += Math.max(0, 40 - (deficit / 10) * 5);
    }

    // Category match (30% weight)
    if (searchParams.category === college.category) {
      score += 30;
    }

    // Region match (20% weight)
    if (!searchParams.region || searchParams.region === college.region) {
      score += 20;
    }

    // Branch match (10% weight)
    if (!searchParams.branch || searchParams.branch === college.branch) {
      score += 10;
    }

    return Math.round(score);
  };

  const getCollegeImages = (imageUrls: string): string[] => {
    const STOCK =
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400";

    if (!imageUrls) return [STOCK];

    let parsed: any = null;
    if (Array.isArray((imageUrls as unknown) as any)) parsed = imageUrls;
    else {
      try {
        parsed = JSON.parse(imageUrls);
      } catch {
        // not JSON; maybe a single URL string
        parsed = imageUrls;
      }
    }

    const backendOrigin = `${window.location.protocol}//${window.location.hostname}:5000`;

    const asArray = Array.isArray(parsed) ? parsed : [parsed];

    const normalized = asArray
      .map((raw: any) => {
        if (!raw) return null;
        const url = String(raw).trim();
        // data URI
        if (/^data:image\//i.test(url)) return url;
        // absolute http(s)
        if (/^https?:\/\//i.test(url)) return url;
        // protocol-less //cdn.example.com/path
        if (/^\/\//.test(url)) return `${window.location.protocol}${url}`;
        // absolute path on backend
        if (url.startsWith("/")) return `${backendOrigin}${url}`;
        // bare host/path like example.com/.. or uploads/..
        if (/^[a-zA-Z0-9.-]+\//.test(url) || url.startsWith("www.")) return `https://${url}`;
        // treat as relative path to backend
        return `${backendOrigin}/${url}`;
      })
      .filter(Boolean) as string[];

    if (normalized.length === 0) return [STOCK];

    return normalized.slice(0, 2);
  };

  return (
    <div className="container" style={{ paddingTop: "2rem" }}>
      <div className="glass-card">
        <h1
          className="text-center mb-2"
          style={{
            fontFamily: "Space Grotesk, sans-serif",
            fontSize: "2.5rem",
            fontWeight: 700,
            background:
              "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          College Finder
        </h1>
        <p className="text-center text-secondary mb-2">
          Find the perfect engineering college based on your MHT-CET percentile
          and preferences
        </p>

        {/* Search Form */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div className="form-group">
            <label className="form-label">MHT-CET Percentile *</label>
            <input
              type="number"
              className="form-input"
              placeholder="Enter your percentile (e.g., 95.5)"
              value={searchParams.percentile || ""}
              onChange={(e) => {
                let val = parseFloat(e.target.value) || 0;
                if (val > 100) val = 100; // enforce max 100
                setSearchParams({
                  ...searchParams,
                  percentile: val,
                });
              }}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={searchParams.category}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  category: e.target.value,
                })
              }
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Region</label>
            <select
              className="form-select"
              value={searchParams.region}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  region: e.target.value,
                })
              }
            >
              <option value="">Any Region</option>
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Branch</label>
            <select
              className="form-select"
              value={searchParams.branch}
              onChange={(e) =>
                setSearchParams({
                  ...searchParams,
                  branch: e.target.value,
                })
              }
            >
              <option value="">Any Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: "1rem 3rem", fontSize: "1.1rem" }}
          >
            <Search size={20} />
            {loading ? "Searching..." : "Find Colleges"}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </div>

      {/* Results */}
      {colleges.length > 0 && (
        <div className="college-cards">
          {colleges.map((college) => {
            const matchPercentage = calculateMatchPercentage(college);
            return (
              <div
                key={college.id}
                className="college-card-horizontal glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  marginBottom: "2rem",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
              >
                {/* College Image - Full width carousel */}
                <div
                  style={{
                    width: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                    marginBottom: "1rem",
                  }}
                >
                  {/* Simple inline carousel (auto-advances) */}
                  <Carousel images={getCollegeImages(college.image_urls)} altPrefix={college.college_name} />
                </div>

                {/* College Info - Right Side */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: "1.5rem",
                          fontWeight: 600,
                          color: "#ffffff",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        {college.college_name}
                      </h3>
                      <div
                        className="match-score"
                        style={{
                          background:
                            matchPercentage >= 80
                              ? "#10b981"
                              : matchPercentage >= 60
                              ? "#f59e0b"
                              : "#ef4444",
                          color: "white",
                          padding: "0.375rem 0.75rem",
                          borderRadius: "9999px",
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Star size={14} />
                        {matchPercentage}%
                      </div>
                    </div>

                    <p
                      className="college-branch"
                      style={{
                        margin: "0.25rem 0",
                        fontSize: "1rem",
                        color: "#cbd5e1",
                        fontWeight: 500,
                      }}
                    >
                      {college.branch}
                    </p>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: "0.75rem",
                        marginTop: "1rem",
                      }}
                    >
                      <div
                        className="detail-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <GraduationCap size={16} style={{ color: "#94a3b8" }} />
                        <span
                          className="detail-label"
                          style={{ fontSize: "0.875rem", color: "#94a3b8" }}
                        >
                          Cutoff
                        </span>
                        <span
                          className="detail-value"
                          style={{ fontWeight: 600, color: "#ffffff" }}
                        >
                          {college.cutoff_percentile}%
                        </span>
                      </div>

                      <div
                        className="detail-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <MapPin size={16} style={{ color: "#94a3b8" }} />
                        <span
                          className="detail-label"
                          style={{ fontSize: "0.875rem", color: "#94a3b8" }}
                        >
                          Region
                        </span>
                        <span
                          className="detail-value"
                          style={{ fontWeight: 600, color: "#ffffff" }}
                        >
                          {college.region}
                        </span>
                      </div>

                      <div
                        className="detail-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <DollarSign size={16} style={{ color: "#94a3b8" }} />
                        <span
                          className="detail-label"
                          style={{ fontSize: "0.875rem", color: "#94a3b8" }}
                        >
                          Fees
                        </span>
                        <span
                          className="detail-value"
                          style={{ fontWeight: 600, color: "#ffffff" }}
                        >
                          ₹{college.fees.toLocaleString()}
                        </span>
                      </div>

                      <div
                        className="detail-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <TrendingUp size={16} style={{ color: "#94a3b8" }} />
                        <span
                          className="detail-label"
                          style={{ fontSize: "0.875rem", color: "#94a3b8" }}
                        >
                          Package
                        </span>
                        <span
                          className="detail-value"
                          style={{ fontWeight: 600, color: "#ffffff" }}
                        >
                          ₹{college.median_package} LPA
                        </span>
                      </div>

                      <div
                        className="detail-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <Star
                          size={16}
                          style={{
                            color:
                              searchParams.percentile >=
                              college.cutoff_percentile
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        />
                        <span
                          className="detail-label"
                          style={{ fontSize: "0.875rem", color: "#94a3b8" }}
                        >
                          Status
                        </span>
                        <span
                          className="detail-value"
                          style={{
                            fontWeight: 600,
                            color:
                              searchParams.percentile >=
                              college.cutoff_percentile
                                ? "#10b981"
                                : "#ef4444",
                          }}
                        >
                          {searchParams.percentile >= college.cutoff_percentile
                            ? "Eligible"
                            : "Not Eligible"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Optional: Add a CTA button or link here if needed */}
                  {/* <button className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>View Details</button> */}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && colleges.length === 0 && searchParams.percentile > 0 && (
        <div className="glass-card text-center">
          <h3 style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
            No colleges found
          </h3>
          <p style={{ color: "var(--text-muted)" }}>
            Try adjusting your search criteria or consider different
            categories/regions.
          </p>
        </div>
      )}
    </div>
  );
};

export default CollegeFinder;
