import { useContext } from "react";
import "../styles/Components.css";
import "../styles/Table.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function GradeTabel() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={` text-${theme === "light" ? "dark" : "light"}`}>
        
        <div className={`component ${theme === "light" ? "dark" : "light"}`}>
          <div className="table-container">
              <table className={`table table-${theme} table-striped`}>
                <thead>
                  <tr>
                    <td>#</td>
                    <td>Author</td>
                    <td>Title</td>
                    <td>Grade</td>
                    <td>Teacher</td>
                  </tr>
                </thead>
                <tbody>
                <tr>
                    <td>2</td>
                    <td>John Doe</td>
                    <td>A work of sth</td>
                    <td>7</td>
                    <td>Joana Mitchels</td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>
    </div>
  );
}
  
  export default GradeTabel;
  