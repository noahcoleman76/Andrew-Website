import React, { useEffect, useState } from "react";
import {
  fetchGalleryImages,
  getGalleryImageFallbackUrls,
  type GalleryImage,
} from "../lib/galleryImages";
import { withBase } from "../utils/basePath";

const Gallery: React.FC = () => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [driveImages, setDriveImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [imageFallbackIndexes, setImageFallbackIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    let isActive = true;

    fetchGalleryImages()
      .then((images) => {
        if (!isActive) {
          return;
        }

        setDriveImages(images);
        setImageFallbackIndexes({});
        setLoadError(false);
      })
      .catch((error) => {
        console.error("Error fetching gallery images:", error);

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

  const getDisplayImageSrc = (img: string) => {
    const fallbacks = getGalleryImageFallbackUrls(img);
    const currentIndex = imageFallbackIndexes[img] ?? 0;

    return fallbacks[Math.min(currentIndex, fallbacks.length - 1)] ?? img;
  };

  const handleImageError = (img: string) => {
    const fallbacks = getGalleryImageFallbackUrls(img);

    if (fallbacks.length <= 1) {
      return;
    }

    setImageFallbackIndexes((current) => {
      const nextIndex = (current[img] ?? 0) + 1;

      if (nextIndex >= fallbacks.length) {
        return current;
      }

      return {
        ...current,
        [img]: nextIndex,
      };
    });
  };

  return (
    <div>
      {/* Image Banner */}
      <section
        style={{
          position: "relative",
          width: "100vw",
          height: "60vh",
          marginLeft: "calc(-50vw + 50%)",
          overflow: "hidden",
        }}
      >
        <img
          src={withBase("images/andrew-skating.png")}
          alt="Andrew skating"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />
      </section>

      {/* Andrew Message Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="row align-items-center">
            {/* Image on the Left */}
            <div className="col-md-5 text-center mb-4 mb-md-0">
              <img
                src={withBase("images/andrew-portrait.jpg")}
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
                Andrew was perseverant and 
                unstoppable. Nothing stood in his way from living life the way he wanted. 
                He loved his family, friends, and was uniquely himself. He enjoyed breakdancing, 
                skateboarding, and spending time with the people he loved. He was friendly to 
                everyone he met and was a light to all who knew him. 
                Anything life threw at him, he powered through. 
                We hope everyone can keep going just like Andrew.{" "}
                <a
                  href="https://www.instagram.com/explore/tags/keepgoingforandrew/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#dd783f", fontWeight: "bold", textDecoration: "none" }}
                >
                  #KeepGoingForAndrew
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

          {!import.meta.env.VITE_GALLERY_DRIVE_URL &&
            !import.meta.env.VITE_STORIES_SHEET_URL && (
            <div className="alert alert-warning" role="alert">
              The Google Drive gallery cannot load until
              `VITE_GALLERY_DRIVE_URL` is configured.
            </div>
          )}
          {loadError &&
            (import.meta.env.VITE_GALLERY_DRIVE_URL ||
              import.meta.env.VITE_STORIES_SHEET_URL) && (
            <div className="alert alert-danger" role="alert">
              The Google Drive gallery could not be loaded.
            </div>
          )}

          {/* Masonry Layout */}
          {loading &&
          (import.meta.env.VITE_GALLERY_DRIVE_URL ||
            import.meta.env.VITE_STORIES_SHEET_URL) ? (
            <p className="text-center">Loading gallery...</p>
          ) : driveImages.length === 0 ? (
            <p className="text-center">No gallery images are available.</p>
          ) : (
            <div className="masonry">
              {driveImages.map((image, i) => {
                const src = getDisplayImageSrc(image.url);

                return (
                  <img
                    key={`${image.url}-${src}`}
                    src={src}
                    alt={image.name ?? `Gallery ${i + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    style={{
                      width: "100%",
                      marginBottom: "15px",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "block",
                    }}
                    onClick={() => setModalImage(src)}
                    onError={() => handleImageError(image.url)}
                  />
                );
              })}
            </div>
          )}
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
