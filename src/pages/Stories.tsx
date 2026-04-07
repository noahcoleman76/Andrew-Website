import React, { useEffect, useState } from "react";
import MemoryCard from "../components/MemoryCard";
import { memories } from "../data/memories";
import { fetchStoryMemories, type StoryMemory } from "../lib/storyMemories";
import { withBase } from "../utils/basePath";

const Stories: React.FC = () => {
    const [sheetMemories, setSheetMemories] = useState<StoryMemory[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        let isActive = true;

        fetchStoryMemories()
            .then((data) => {
                if (!isActive) {
                    return;
                }

                setSheetMemories(data);
                setLoadError(false);
            })
            .catch((error) => {
                console.error("Error fetching story memories:", error);

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

    const storyMemories = sheetMemories.length > 0
        ? sheetMemories
        : [...memories]
            .sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .map((memory) => ({
                name: memory.name,
                date: memory.date,
                message: memory.message,
                imageFolder: memory.folder,
                imageUrls: [] as string[],
            }));

    return (
        <>
            <div className="position-relative">
                {/* Page Content */}
                <div>
                    {/* Hero Section */}
                    <section
                        className="hero-section position-relative text-white"
                        style={{
                            backgroundImage: `url('${withBase("images/skater.jpg")}')`,
                        }}
                    >
                        <div className="hero-overlay position-absolute top-0 start-0 w-100 h-100" />

                        {/* Portrait */}
                        <div className="hero-portrait">
                            <div className="portrait-frame">
                                <img
                                    src={withBase("images/andrew-portrait.jpg")}
                                    alt="Andrew"
                                    className="portrait-img"
                                />
                            </div>
                        </div>

                        {/* Hero Text */}
                        <div className="position-relative text-center hero-text">
                            <h1 className="fw-bold mb-3 hero-title g-title">Andrew Murray</h1>
                            <p className="hero-subtitle">1997 – 2026</p>
                        </div>
                    </section>


                    {/* Submit Memories Section */}
                    <section className="bg-white py-5 text-center shadow-sm">
                        <div className="container">
                            <h2 className="mb-3 section-heading">
                                We'd love to hear from you
                            </h2>
                            <p className="lead mb-4 section-subtext">
                                Please share any memories or stories you have with Andrew. You
                                can share what it means to you to <strong>#KeepGoingForAndrew</strong> or
                                leave a message for him. Any pictures are appreciated.
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSfG8uW9_7z8bxf0gHznt0wpj_6qUDgiyLfh7AoNWue_qV5xoQ/viewform"
                                className="btn btn-lg text-white px-5 py-3 leave-message-btn"
                                style={{
                                    backgroundColor: "#dd783f",
                                    borderColor: "#dd783f",
                                    color: "#fff",
                                }}
                            >
                                <i className="bi bi-pencil-fill me-2"></i> Leave a Message
                            </a>
                        </div>
                    </section>

                    {/* Stories & Memories */}
                    <section className="py-5">
                        <div className="container">
                            <h2 className="mb-4 text-center section-heading">
                                Stories & Memories
                            </h2>
                            {!import.meta.env.VITE_STORIES_SHEET_URL && (
                                <div className="alert alert-warning" role="alert">
                                    Stories are still using the local fallback data until
                                    `VITE_STORIES_SHEET_URL` is configured.
                                </div>
                            )}
                            {loadError && import.meta.env.VITE_STORIES_SHEET_URL && (
                                <div className="alert alert-danger" role="alert">
                                    The Google Sheet could not be loaded, so the page is showing
                                    the local fallback memories instead.
                                </div>
                            )}
                            {loading && import.meta.env.VITE_STORIES_SHEET_URL ? (
                                <p className="text-center">Loading memories...</p>
                            ) : (
                                storyMemories.map((memory, index) => (
                                    <MemoryCard
                                        key={`${memory.name}-${memory.date}-${index}`}
                                        name={memory.name}
                                        date={memory.date}
                                        message={memory.message}
                                        imageFolder={memory.imageFolder}
                                        imageUrls={memory.imageUrls}
                                    />
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default Stories;
