import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import WorkTable from "../components/work/WorkTable";


function Works() {
  const { theme } = useContext(ThemeContext);;


  return (
    <div className={`main-container ${theme} works text-${theme === "light" ? "dark" : "light"}`}>
        <WorkTable />
    </div>
  );
}
  
export default Works;
  