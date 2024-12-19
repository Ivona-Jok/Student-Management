import React from "react";
import ThemeSwitcher from "../theme/ThemeSwitcher";

function Header() {
return (
    <div id="header">
    <header className="py-3 mb-2 border-bottom bg-light">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
            <h2 className="me-4">SM</h2>
            <form className="flex-grow-1 me-3">
             <input
                type="search"
                className="form-control"
                placeholder="Search..."
                aria-label="Search"
                />
            </form>
            <ThemeSwitcher />
        </div>
      </header>
    </div>
  );
}

export default Header;
