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
                                    src={withBase("images/andrew-main.JPG")}
                                    alt="Andrew"
                                    className="portrait-img"
                                />
                            </div>
                        </div>

                        {/* Hero Text */}
                        <div className="position-relative text-center hero-text">
                            <h1 className="fw-bold mb-3 hero-title g-title">Andrew Murray</h1>
                            <p className="hero-subtitle">1997 – 2026</p>
                            <a
                                href="#stories-memories"
                                className="btn btn-lg text-white px-5 py-3 mt-4 leave-message-btn hero-scroll-btn"
                            >
                                View Memories
                            </a>
                        </div>
                    </section>

                    <section className="life-tribute-section py-5">
                        <div className="container">
                            <div className="life-tribute-card mx-auto">
                                <div className="life-tribute-intro text-center">
                                    <h2 className="section-heading mb-3">A Life Lived Fully</h2>
                                </div>

                                <div className="life-tribute-body">
                                    <p className="lead mb-4 section-subtext life-tribute-text">
                                    Andrew was resilient and determined— he lived fully on his own
                                    terms, guided by his belief that everything happens for a
                                    reason. He was deeply kind and loving toward his family,
                                    friends, and everyone he met.
                                    </p>
                                    <p className="lead mb-4 section-subtext life-tribute-text">
                                    He had a passion for breakdancing, skateboarding, music, and
                                    spending time with the people he loved most. He never gave up,
                                    always pushing forward while trusting life’s meaning. Known
                                    for his humor, he loved being silly, was always cracking
                                    jokes, and bringing light to everyday moments. His outlook,
                                    combined with his drive for self-improvement, kept him
                                    grounded and inspired others to grow as well.
                                    </p>

                                    <p className="lead mb-4 section-subtext life-tribute-text">
                                    Andrew’s final words to his fiancée were, “You have to keep
                                    going,” a promise he asked her to carry forward. Those who
                                    knew and loved him are encouraged to honor that promise.
                                    </p>
                                    <p className="lead mb-4 section-subtext life-tribute-text">
                                    So live life fully on your own terms, stay true to your
                                    genuine self, and keep moving forward with strength, love, and
                                    intention— carrying forward the spirit Andrew embodied in his
                                    own life.
                                    </p>
                                </div>

                                <div className="life-tribute-tagline text-center">
                                    #KeepGoingForAndrew
                                </div>
                            </div>
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
                    <section className="py-5" id="stories-memories">
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
