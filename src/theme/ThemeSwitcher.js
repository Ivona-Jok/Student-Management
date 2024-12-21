import React, { useContext } from "react";
import { ThemeContext } from "./Theme";
import '../styles/Theme.css';

function ThemeSwitcher() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    

    return (
        <div className="theme">
            <button onClick={toggleTheme} className={`btn ${theme}`}>
                {theme === 'light' ? (
                    <i className="fas fa-moon"></i>
                ) : (
                    <i className="fas fa-sun"></i>
                )}
            </button>
        </div>
    );
}

export default ThemeSwitcher;
