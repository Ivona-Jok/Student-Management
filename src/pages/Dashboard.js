import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Dashboard() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`dashboard text-${theme === "light" ? "dark" : "light"}`}>
        {t("dashboard")}
    </div>
  );
}
  
  export default Dashboard;
  