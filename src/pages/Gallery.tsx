import React, { useState, useMemo } from "react";
import { withBase } from "../utils/basePath";

const Gallery: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Import all images at build time
  const imageImports = import.meta.glob("/public/images/**/*.{jpg,jpeg,png}", {
    eager: true,
  });

  // Convert imported files to an array of paths
  const allImages = Object.keys(imageImports).map((path) =>
    withBase(path.replace("/public/", ""))
  );

  // Shuffle images once when component loads
  const shuffledImages = useMemo(() => {
    return [...allImages].sort(() => Math.random() - 0.5);
  }, [allImages]);

  return (
    <div>
      {/* Video Banner */}
      <section
        style={{
          position: "relative",
          width: "100vw",
          height: "60vh",
          marginLeft: "calc(-50vw + 50%)",
          overflow: "hidden",
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          <source
            src={withBase("images/videos/gallery-video.mp4")}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* Andrew Message Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            {/* Image on the Left */}
            <div className="col-md-5 text-center mb-4 mb-md-0">
              <img
                src={withBase("images/garrett-portrait.jpg")}
                alt="Andrew"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "400px", objectFit: "cover" }}
              />
            </div>

            {/* Text on the Right */}
            <div className="col-md-7">
              <p
                className="lead"
                style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize: "1.1rem",
                  lineHeight: "1.6",
                }}
              >
                Garrett lived life to the fullest. He loved serving in the temple.
                He read his scriptures regularly and said his prayers and was{" "}
                <em>"all-in"</em> on the gospel. He loved Hawaii and finding adventure
                everywhere he went. He set goals and was determined to reach those
                goals. He included others and wanted everyone to feel included and
                involved. He loved being healthy and eating salad! We encourage
                everyone to{" "}
                <a
                  href="https://www.instagram.com/explore/tags/livelikegarrett/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#dd783f", fontWeight: "bold", textDecoration: "none" }}
                >
                  #LiveLikeGarrett
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-5">
        <div className="container">
          {/* Header */}
          <h2
            className="mb-4 text-center"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.5rem",
            }}
          >
            Andrew's Gallery
          </h2>

          {/* Masonry Layout */}
          <div className="masonry">
            {shuffledImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Gallery ${i + 1}`}
                loading="lazy" // Lazy load
                style={{
                  width: "100%",
                  marginBottom: "15px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "block",
                }}
                onClick={() => setModalImage(img)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalImage && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.7)" }}
          onClick={() => setModalImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <img
              src={modalImage}
              alt="Full Size"
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      )}

      {/* Masonry Responsive Styles */}
      <style>
        {`
          .masonry {
            column-count: 3;
            column-gap: 15px;
          }
          @media (max-width: 991px) {
            .masonry {
              column-count: 2;
            }
          }
          @media (max-width: 767px) {
            .masonry {
              column-count: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Gallery;
