import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import StudentTable from "../components/student/StudentTable";
import { useAuth } from "../utils/auth";

function Student() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className={`main-container ${theme} student text-${theme === "light" ? "dark" : "light"}`}>
        <h2>{t("students")}</h2>
        <StudentTable />
    </div>
  );
}
  
export default Student;
  