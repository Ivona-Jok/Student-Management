import { useContext, useState } from "react";
import "../styles/Components.css";
import { Link } from "react-router-dom";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("/");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`d-flex flex-column flex-shrink-0 p-3 bg-${theme} rounded border`} style={{ width: "250px" }}>
      <ul className="nav nav-pills flex-column mb-auto ">
        <li>
          <Link to="/" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/")} >
            <i className="fa-solid fa-gauge me-2"></i> 
            {t("dashboard")}
          </Link>
        </li>
        <li>
          <Link to="/student" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/student" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/student")} >
            <i className="fa-solid fa-graduation-cap me-2"></i>
            {t("student")}
          </Link>
        </li>
        <li>
          <Link to="/grades" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/grades" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/grades")} >
            <i className="fa-solid fa-file me-2"></i>
            {t("grades")}
          </Link>
        </li>
        <li>
          <Link to="/works" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/works" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/works")} >
            <i className="fa-solid fa-folder me-2"></i>
            {t("works")}
          </Link>
        </li>
        <li>
          <Link to="/settings" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/settings" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/settings")} >
            <i className="fa-solid fa-gear me-2"></i>
            {t("settings")}
          </Link>
        </li>
      </ul>

      <ul className="nav nav-pills flex-column mt-auto">
        <hr className={`link-${theme === "light" ? "dark" : "light"}`} />
        <li>
          <Link to="/login" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/login" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/login")} >
          {t("login")}
          </Link>
        </li>
        <li>
          <Link to="/register" className={`nav-link link-${theme === "light" ? "dark" : "light"} ${activeTab === "/register" ? "active" : ""} d-flex align-items-center`} onClick={() => handleTabClick("/register")} >
          {t("register")}
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
