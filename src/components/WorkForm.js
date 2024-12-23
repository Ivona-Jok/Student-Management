import { useContext } from "react";
import "../styles/Components.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function WorkForm() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={` text-${theme === "light" ? "dark" : "light"}`}>
        {t("works")} Form 
    </div>
  );
}
  
  export default WorkForm;
  