import React, { useEffect, useState } from "react";
import { fetchFamilyMessages, type FamilyMessage } from "../lib/familyMessages";
import { withBase } from "../utils/basePath";

const Family: React.FC = () => {
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isActive = true;

    fetchFamilyMessages()
      .then((data) => {
        if (!isActive) {
          return;
        }

        setMessages(data);
        setLoadError(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);

        if (!isActive) {
          return;
        }

        setLoadError(true);
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="d-flex align-items-center justify-content-center text-white"
        style={{
          height: "60vh",
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          backgroundImage: `url('${withBase("images/family-mash.jpg")}')`,
          backgroundSize: "cover",
          backgroundPosition: "Top center",
          position: "relative",
        }}
      >
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
          Messages to the family
        </h1>
      </section>

      {/* Messages Section */}
      <section className="py-5">
        <div className="container">
          {!import.meta.env.VITE_STORIES_SHEET_URL && (
            <div className="alert alert-warning" role="alert">
              Family messages require `VITE_STORIES_SHEET_URL` to be configured.
            </div>
          )}
          {loadError && import.meta.env.VITE_STORIES_SHEET_URL && (
            <div className="alert alert-danger" role="alert">
              The family messages could not be loaded.
            </div>
          )}
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            <div className="row">
              {messages.map((msg, index) => (
                <div className="col-12 mb-4" key={index}>
                  <div
                    className="card p-4 shadow-sm"
                    style={{
                      border: "none",
                      borderRadius: "12px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          margin: 0,
                        }}
                      >
                        {msg.name}
                      </h5>
                      <small
                        style={{
                          fontFamily: "'Open Sans', sans-serif",
                          color: "#777",
                        }}
                      >
                        {msg.date}
                      </small>
                    </div>
                    <p
                      style={{
                        fontFamily: "'Open Sans', sans-serif",
                        whiteSpace: "pre-line",
                        marginBottom: 0,
                      }}
                    >
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Family;
