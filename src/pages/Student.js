import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from '../utils/auth';

function Student() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className={`student text-${theme === "light" ? "dark" : "light"}`}>
        {t("student")}
        <p>Welcome, {user.email}!</p>
    </div>
  );
}
  
  export default Student;
  