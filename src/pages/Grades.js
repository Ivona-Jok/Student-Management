import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Grades() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`grades text-${theme === "light" ? "dark" : "light"}`}>
        {t("grades")}
    </div>
  );
}
  
  export default Grades;
  