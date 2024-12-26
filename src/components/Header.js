import React, { useContext, useEffect, useState } from "react";
import "../styles/Components.css";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "../languages/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../theme/Theme";
import { useAuth } from "../utils/auth"

function Header() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [works, setWorks] = useState([]);
  const [filteredWorks, setFilteredWorks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth(); 

  useEffect(() => {
    fetch("/db.json")
      .then((response) => response.json())
      .then((data) => {
        setWorks(data.works || []);
        setFilteredWorks(data.works || []);
      })
      .catch((error) => console.error("Error fetching works:", error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = works.filter((work) =>
      work.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredWorks(filtered);
  };



  return (
    <div id="header" className={`header text-${theme === "light" ? "dark" : "light"}`}>
      <header className={`py-3 mb-2 border-bottom bg-${theme}`}>
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <h2 className="me-4">{t("header_txt")}</h2>
          <form className="flex-grow-1 me-3">
            <input
              type="search"
              className={`form-control ${theme}`}
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search"
            />
          </form>
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
}

export default Header;
