import { useContext } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function Error() {
  const { theme } = useContext(ThemeContext);;
  const { t } = useTranslation();

  return (
    <div className={`main-container error text-${theme === "light" ? "dark" : "light"}`}>
        {t("error")}
    </div>
  );
}
  
  export default Error;
  