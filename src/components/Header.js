import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div id="header">
            <nav className="py-2 bg-dark border-bottom">
                <div className="container d-flex flex-wrap justify-content-between">
                    <ul className="nav me-auto">
                        <li className="nav-item">
                            <Link to="/" className="nav-link text-light" aria-current="page">
                              Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/student" className="nav-link link-light px-2">
                                Student
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/works" className="nav-link link-light px-2">
                                Works
                            </Link>
                        </li>
                    </ul>
                    <ul className="nav">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link link-light px-2">
                                Log In
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link link-light px-2">
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>

            <header className="py-3 mb-4 border-bottom bg-light">
                <div className="container d-flex flex-wrap justify-content-center">
                    <Link to="/" className="d-flex align-items-center mb-3 mb-lg-0 me-lg-auto text-dark text-decoration-none">
                        <span className="fs-4">Student Managment</span>
                    </Link>
                    <form className="col-12 col-lg-auto mb-3 mb-lg-0">
                        <input
                            type="search"
                            className="form-control"
                            placeholder="Search..."
                            aria-label="Search"
                        />
                    </form>
                </div>
            </header>
        </div>
  );
}

export default Header;
