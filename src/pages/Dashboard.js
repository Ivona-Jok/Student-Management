import { useContext, useEffect, useState } from "react";
import "../styles/Main.css";
import "../styles/Dashboard.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import ChartComponent from "../components/ChartComponent";
import Calendar from "../components/Calendar";

function Dashboard() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [topWorks, setTopWorks] = useState([]);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);

        // Sort works by grade and take the top 3
        const sortedWorks = data.works
          .sort((a, b) => parseInt(b.grade) - parseInt(a.grade))
          .slice(0, 3);

        setTopWorks(sortedWorks);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
      });
  }, []);

  return (
    <div className={`main-container ${theme} dashboard text-${theme === "light" ? "dark" : "light"}`}>
      <h2>{t("dashboard")}</h2>

      <div className="d-flex flex-row justify-content-between mt-5">
        <div className="d-flex flex-column left">
          <div className="container">
            <ChartComponent />
          </div>
        </div>

        <div className="d-flex flex-column right">
          <div className="container calendar-container">
            <Calendar />
          </div>
          <div className="container top-works-container">
            <h4>{t("topWorks")}</h4>
            <ul className="top-works-list">
              {topWorks.map((work) => (
                <li key={work.id} className="work-item">
                  <div className="work-title">
                    <strong>{work.title}</strong>
                  </div>
                  <button className="work-grade-btn">{work.grade}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
