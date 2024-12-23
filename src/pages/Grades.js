import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import GradeTabel from "../components/GradeTable";

function Grades() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container grades text-${theme === "light" ? "dark" : "light"}`}>
        {t("grades")}
        <GradeTabel />
    </div>
  );
}
  
  export default Grades;
  