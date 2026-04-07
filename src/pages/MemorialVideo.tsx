import React from "react";
import { Link } from "react-router-dom";
import { withBase } from "../utils/basePath";

const MemorialVideo: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-white"
        style={{
          height: "60vh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)", // ensures full-width outside container
          backgroundImage: `url('${withBase("images/missouri.png")}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay for readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.4)",
          }}
        />
        <h1
          className="position-relative fw-bold"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "3rem",
            textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
          }}
        >
          Andrew Murray Memorial Service
        </h1>
      </section>


      {/* Content Section */}
      <section className="py-5 bg-white">
        <div className="container text-center">
          <p
            className="lead mb-4"
            style={{
              fontFamily: "'Open Sans', sans-serif",
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            Memorial media coming soon.
          </p>

          <div
            style={{
              alignItems: "center",
              background: "#f7efe7",
              border: "1px solid rgba(221, 120, 63, 0.25)",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              color: "#7a4b32",
              display: "flex",
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              justifyContent: "center",
              margin: "0 auto 30px",
              maxWidth: "100%",
              minHeight: "260px",
              padding: "2rem",
            }}
          >
            Memorial media coming soon
          </div>

          {/* Link to Share a Message */}
          <Link
            to="https://docs.google.com/forms/d/e/1FAIpQLSc-Lc8quJE-lSdMErH7XMewjVPhMtVRtifh64sRfeqPJU1RmA/viewform"
            style={{
              display: "inline-block",
              padding: "12px 30px",
              backgroundColor: "#dd783f",
              color: "white",
              borderRadius: "30px",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
              transition: "background-color 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#c56b35")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#dd783f")
            }
          >
            Share a Memory or Message
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MemorialVideo;
