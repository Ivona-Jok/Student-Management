import { useState } from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  // State to track the active tab
  const [activeTab, setActiveTab] = useState("/");

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light rounded border"
      style={{ width: "250px" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/" className={`nav-link link-dark ${activeTab === "/" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/")} >
            <i className="fa-solid fa-gauge me-2"></i> 
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/student" className={`nav-link link-dark ${activeTab === "/student" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/student")} >
            <i className="fa-solid fa-graduation-cap me-2"></i>
            Student
          </Link>
        </li>
        <li>
          <Link to="/grades" className={`nav-link link-dark ${activeTab === "/grades" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/grades")} >
            <i className="fa-solid fa-file me-2"></i>
            Grades
          </Link>
        </li>
        <li>
          <Link to="/works" className={`nav-link link-dark ${activeTab === "/works" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/works")} >
            <i className="fa-solid fa-folder me-2"></i>
            Works
          </Link>
        </li>
        <li>
          <Link to="/settings" className={`nav-link link-dark ${activeTab === "/settings" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/settings")} >
            <i className="fa-solid fa-gear me-2"></i>
            Settings
          </Link>
        </li>
      </ul>

      <ul className="nav nav-pills flex-column mt-auto">
        <hr />
        <li>
          <Link to="/login" className={`nav-link link-dark ${activeTab === "/login" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/login")} >
            Log In
          </Link>
        </li>
        <li>
          <Link to="/register" className={`nav-link link-dark ${activeTab === "/register" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/register")} >
            Register
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
