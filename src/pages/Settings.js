import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "../languages/LanguageSwitcher";

function Settings() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className={`main-container ${theme} settings text-${theme === "light" ? "dark" : "light"}`}>
      <h2 className="page-title">{t("settings")}</h2>

      <div className="setting-item">
        <label htmlFor="theme-switcher">{t("changeTheme")}</label>
        <ThemeSwitcher id="theme-switcher" />
      </div>

      <div className="setting-item">
        <label htmlFor="language-switcher">{t("changeLanguage")}</label>
        <LanguageSwitcher id="language-switcher" />
      </div>
    </div>
  );
}

export default Settings;
