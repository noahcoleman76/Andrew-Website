import React, { useEffect, useState } from "react";
import { withBase } from "../utils/basePath";

interface FamilyMessage {
  name: string;
  message: string;
  date: string;
}

const Family: React.FC = () => {
  const [messages, setMessages] = useState<FamilyMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://script.google.com/macros/s/AKfycbzUxZnglJk0g-N97yz7fCKqMbUYg-QAv9ZR8Cy_2QPvAY0Sq6Uoia7r7FnNQlTTF4H7NA/exec"
    )
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMessages(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
        setLoading(false);
      });
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
          backgroundImage: `url('${withBase("images/andrew-family2.jpeg")}')`,
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
