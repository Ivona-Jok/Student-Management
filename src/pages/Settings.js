import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Settings() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container ${theme} settings text-${theme === "light" ? "dark" : "light"}`}>
        {t("settings")}
    </div>
  );
}
  
  export default Settings;
  