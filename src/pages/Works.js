import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Works() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`works text-${theme === "light" ? "dark" : "light"}`}>
        {t("works")}
    </div>
  );
}
  
  export default Works;
  