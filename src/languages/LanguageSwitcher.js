import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === "en" ? "sr" : "en";
    i18n.changeLanguage(newLanguage);
  }

  return (
    <div className="btn-group">
      <button className="btn btn-primary" onClick={toggleLanguage}>
        {i18n.language === "en" ? "SR" : "EN"}
      </button>
    </div>
  );
};

export default LanguageSwitcher;
