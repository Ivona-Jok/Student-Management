import React, { useContext, useEffect, useState } from "react";
import "../styles/Components.css";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../theme/Theme";
import { useAuth } from "../utils/auth";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth();
  const [works, setWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        setWorks(data.works || []);
      })
      .catch((error) => console.error("Error fetching works:", error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.toLowerCase() === "dashboard") {
      navigate("/");
    } else if (query.toLowerCase() === "students") {
      navigate("/student");
    } else if (query.toLowerCase() === "grades") {
      navigate("/grades");
    } else if (query.toLowerCase() === "works") {
      navigate("/works");
    } else if (query.toLowerCase() === "settings") {
      navigate("/settings");
    } else if (query.toLowerCase() === "logout" && user) {
      navigate("/login"); 
    }
  };

  return (
    <div id="header" className="header text">
      <header className={`py-3 mb-2 bg-comp-${theme}`}>
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <form className="flex-grow-1 me-3 input">
            <input
              type="search"
              className={`form-control ${theme}`}
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search"
            />
          </form>
          {user ? (
            <div className={`user-info text-${theme}`}>
              <Link to="/profile" className="d-flex align-items-center">
                <i className="fa fa-user-circle me-2"></i>
                <span>{`Hello, ${user.firstName}`}</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className={`btn btn-${theme === "light" ? "dark" : "light"}`}>
              {t("login")}
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
