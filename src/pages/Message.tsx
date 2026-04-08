import React, { useState } from "react";
import { submitFamilyMessage } from "../lib/familyMessages";
import { withBase } from "../utils/basePath";

const Message: React.FC = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim values to check for non-empty
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert("Please fill out all fields before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFamilyMessage({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      alert("Message sent successfully!");
      // Clear form after successful submit
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error("Network or server error:", err);
      alert("There was a network or server error.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay */}
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
          Send the family a message
        </h1>
      </section>

      {/* Two-Column Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            {/* Left Column */}
            <div className="col-md-6 mb-4">
              <h2 style={{ fontFamily: "'Playfair Display', serif" }}>
                Send a Message
              </h2>
              <p
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                }}
              >
                If you'd like to reach out to anyone in Andrew's immediate
                family, please send a message here. This will reach any or all
                members of the family including Ellen, Chris, Kalli, and Annie.
              </p>
              <img
                src={withBase("images/andrew-family.jpg")}
                alt="Andrew's Family"
                className="img-fluid rounded shadow"
              />
            </div>

            {/* Right Column (Form) */}
            <div className="col-md-6 d-flex align-items-center">
              <form
                onSubmit={handleSubmit}
                style={{ width: "100%" }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ ...inputStyle, height: "250px" }} // taller message box
                ></textarea>
                <button
                  type="submit"
                  style={buttonStyle}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* Styles */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "1rem",
  fontFamily: "'Open Sans', sans-serif",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#dd783f",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1rem",
};

export default Message;
