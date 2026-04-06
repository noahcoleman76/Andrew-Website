import React, { useEffect, useState } from "react";
import { withBase } from "../utils/basePath";
import { getStoryImageFallbackUrls } from "../lib/storyMemories";

interface MemoryCardProps {
  name: string;
  date: string;
  message: string;
  imageFolder?: string;
  imageUrls?: string[];
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  name,
  date,
  message,
  imageFolder,
  imageUrls = [],
}) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [imageFallbackIndexes, setImageFallbackIndexes] = useState<Record<string, number>>({});

  useEffect(() => {
    if (imageUrls.length > 0) {
      setImages(imageUrls);
      setImageFallbackIndexes({});
      return;
    }

    if (!imageFolder) {
      setImages([]);
      setImageFallbackIndexes({});
      return;
    }

    // Attempt to load images dynamically
    const maxImages = 20; // Max number to check
    const loadedImages: string[] = [];

    let promises: Promise<void>[] = [];
    for (let i = 1; i <= maxImages; i++) {
      const imagePath = withBase(`${imageFolder}/image${i}.jpeg`);
      const img = new Image();
      const promise = new Promise<void>((resolve) => {
        img.onload = () => {
          loadedImages.push(imagePath);
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imagePath;
      });
      promises.push(promise);
    }

    Promise.all(promises).then(() => {
      setImages(loadedImages);
      setImageFallbackIndexes({});
    });
  }, [imageFolder, imageUrls]);

  const getDisplayImageSrc = (img: string) => {
    const fallbacks = getStoryImageFallbackUrls(img);
    const currentIndex = imageFallbackIndexes[img] ?? 0;

    return fallbacks[Math.min(currentIndex, fallbacks.length - 1)] ?? img;
  };

  const handleImageError = (img: string) => {
    const fallbacks = getStoryImageFallbackUrls(img);

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
    <>
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          {/* Name and Date */}
          <div className="d-flex justify-content-between mb-2">
            <span className="fw-bold">{name}</span>
            <small className="text-muted">
              {date}
            </small>
          </div>

          {/* Message */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                whiteSpace: "pre-line",
                textAlign: "left",            // text remains left-aligned
              }}
              className="card-text"
            >
              {message}
            </div>
          </div>

          {/* Images */}
          {images.length > 0 && (
            <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
              {images.map((img, i) => (
                <img
                  key={`${img}-${getDisplayImageSrc(img)}`}
                  src={getDisplayImageSrc(img)}
                  alt={`${name} Memory ${i + 1}`}
                  referrerPolicy="no-referrer"
                  style={{
                    height: "250px",
                    width: "auto",
                    maxWidth: "100%",
                    display: "block",
                    cursor: "pointer",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                  onClick={() => setModalImage(getDisplayImageSrc(img))}
                  onError={() => handleImageError(img)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default MemoryCard;
