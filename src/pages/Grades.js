import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import GradeTable from "../components/GradeTable";

function Grades() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container ${theme} grades text-${theme === "light" ? "dark" : "light"}`}>
        <h2>{t("grades")}</h2>
        <GradeTable />
    </div>
  );
}
  
  export default Grades;
  