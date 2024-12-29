import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import GradeTable from "../components/GradeTable";

function Grades() {
  const { theme } = useContext(ThemeContext);;

  return (
    <div className={`main-container ${theme} grades text-${theme === "light" ? "dark" : "light"}`}>
        <GradeTable />
    </div>
  );
}
  
  export default Grades;
  