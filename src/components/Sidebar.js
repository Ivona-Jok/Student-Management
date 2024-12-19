import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="d-flex flex-column  text-white">
      <nav className="navbar navbar-dark bg-dark flex-column p-3 col-md-3 col-lg-2 d-md-block bg-light sidebar">
        <div className="container-fluid">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/" className="nav-link text-light" aria-current="page">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/grades" className="nav-link text-light">
                Grades
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/student" className="nav-link text-light">
                Student
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/works" className="nav-link text-light">
                Works
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link text-light">
                Settings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link text-light">
                Log In
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/register" className="nav-link text-light">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
