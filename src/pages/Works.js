import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import WorkTable from "../components/work/WorkTable";
import { useAuth } from "../utils/auth";

function Works() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className={`main-container ${theme} works text-${theme === "light" ? "dark" : "light"}`}>
        {t("works")}
        <WorkTable />
    </div>
  );
}
  
export default Works;
  