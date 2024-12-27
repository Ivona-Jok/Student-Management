import { useContext, useState } from "react";
import "../styles/Components.css";
import "../styles/Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("/");

  const location = useLocation();

  const pageName = location.pathname.split("/").pop(); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 bg-comp-${theme} height-100vh`} style={{ width: "250px" }}>
      <h2 className="me-4 page-name">{t(pageName || "dashboard")}</h2>
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/" className={`nav-link link ${activeTab === "/" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/")}>
            <i className="fa-solid fa-gauge me-2"></i> 
            {t("dashboard")}
          </Link>
        </li>
        <li>
          <Link to="/student" className={`nav-link link ${activeTab === "/student" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/student")}>
            <i className="fa-solid fa-graduation-cap me-2"></i>
            {t("students")}
          </Link>
        </li>
        <li>
          <Link to="/grades" className={`nav-link link ${activeTab === "/grades" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/grades")}>
            <i className="fa-solid fa-file me-2"></i>
            {t("grades")}
          </Link>
        </li>
        <li>
          <Link to="/works" className={`nav-link link ${activeTab === "/works" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/works")}>
            <i className="fa-solid fa-folder me-2"></i>
            {t("works")}
          </Link>
        </li>
        <li>
          <Link to="/settings" className={`nav-link link ${activeTab === "/settings" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/settings")}>
            <i className="fa-solid fa-gear me-2"></i>
            {t("settings")}
          </Link>
        </li>
      </ul>

      <ul className="nav nav-pills flex-column mt-auto">
        <hr className={`link`} />
        <li>
          {user ? (
            <button className={`nav-link link ${activeTab === "/logout" ? "active" : ""} d-flex align-items-center`} onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket me-2"></i>
              {t("logout")}
            </button>
          ) : (
            <Link to="/login" className={`nav-link link ${activeTab === "/login" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/login")}>
              {t("login")}
            </Link>
          )}
        </li>
        {!user && (
          <li>
            <Link to="/register" className={`nav-link link ${activeTab === "/register" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/register")}>
              {t("register")}
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
