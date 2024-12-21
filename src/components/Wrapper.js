import { useContext } from "react";
import { ThemeContext } from "../theme/Theme";

function Wrapper( children ) {
    const { theme } = useContext(ThemeContext);

    return(
        <div className={`wrap ${theme}`}>
            {children}
        </div>
    )
}

export default Wrapper;