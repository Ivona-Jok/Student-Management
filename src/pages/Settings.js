import { useState, useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import ThemeSwitcher from "../theme/ThemeSwitcher";
import LanguageSwitcher from "../languages/LanguageSwitcher";
import SettingsRole from "../components/settings/SettingsRole";
import { useAuth } from '../utils/auth';
import "../styles/Components.css";
import HistoryWorks from "../components/work/HistoryWorks";
import "../styles/HistoryWorks.module.css";

function Settings() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth(); 
  

  // Stanje za workId
  const [workId, setWorkId] = useState(null);


  return (
    <div className={`main-container ${theme} settings text-${theme === "light" ? "dark" : "light"}`}>

      <div className="setting-item">
        <label htmlFor="theme-switcher">{t("changeTheme")}</label>
        <ThemeSwitcher id="theme-switcher" />
      </div>

      <div className="setting-item">
        <label htmlFor="language-switcher">{t("changeLanguage")}</label>
        <LanguageSwitcher id="language-switcher" />
      </div>

      <div className="setting-item">
        <label htmlFor="role-switcher">{t("changeRole")}</label>
        {user.role.includes("admin") ? <SettingsRole /> : <p className="info">Uloge može mijenjati samo admin.</p>}
      </div>

      <div className="container">
          {user.role.includes("admin") ? (
            <HistoryWorks workId={workId} setWorkId={setWorkId} />
          ) : (
            <p className="info">Istoriju promjena može vidjeti samo admin.</p>
          )}
      </div>

    </div>

  );
}

export default Settings;
