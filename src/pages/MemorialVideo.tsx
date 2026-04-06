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
          backgroundImage: `url('${withBase("images/wave.png")}')`,
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
            We invite you to watch and remember Andrew's life and the
            legacy he leaves behind. This video captures the love, joy, and
            devotion he shared with everyone around him.
          </p>

          {/* Responsive YouTube Embed */}
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9 aspect ratio
              height: 0,
              overflow: "hidden",
              maxWidth: "100%",
              background: "#000",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              marginBottom: "30px",
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/UpEfVV_VIzM?start=3"
              title="Andrew Murray Memorial Service"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            ></iframe>
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
