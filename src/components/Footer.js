import { useContext } from "react";
import "../styles/Components.css";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../theme/Theme";


function Footer() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <footer className={`footer py-5 bg-comp-${theme} mt-2`}>
      <div className="container text-center">
        <span className={`text text-${theme}`}> 
          {t("footer_txt")} @ 2024.</span>
      </div>
    </footer>
  );
}

export default Footer;
