import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import WorkForm from "../components/WorkForm";

function Works() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container works text-${theme === "light" ? "dark" : "light"}`}>
        {t("works")}
        <WorkForm />
    </div>
  );
}
  
  export default Works;
  