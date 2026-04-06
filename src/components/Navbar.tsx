import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleToggle = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeMenu = () => {
        setIsNavOpen(false);
    };

    return (
        <nav className="navbar navbar-expand-md navbar-light bg-light fixed-top shadow-sm">
            <div className="container">
                {/* Brand */}
                <NavLink
                    to="/"
                    className="navbar-brand fw-bold fs-4"
                    style={{ color: "#dd783f" }}
                    onClick={closeMenu}
                >
                    Andrew Murray
                </NavLink>

                {/* Hamburger toggle button */}
                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={handleToggle}
                    aria-controls="navbarNav"
                    aria-expanded={isNavOpen}
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible menu */}
                <div
                    className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}
                    id="navbarNav"
                >
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/" end className="nav-link text-dark" onClick={closeMenu}>
                                Stories
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/gallery" className="nav-link text-dark" onClick={closeMenu}>
                                Gallery
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/memorial-video" className="nav-link text-dark" onClick={closeMenu}>
                                Memorial Video
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/message" className="nav-link text-dark" onClick={closeMenu}>
                                Message the Family
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
