import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import StudentForm from "../components/student/StudentForm";
import StudentTable from "../components/student/StudentTable";

function Student() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container ${theme} student text-${theme === "light" ? "dark" : "light"}`}>
        {t("student")}
        <StudentForm />
        <StudentTable />
    </div>
  );
}
  
  export default Student;
  