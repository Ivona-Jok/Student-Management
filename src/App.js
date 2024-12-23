import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import Student from "./pages/Student";
import Settings from "./pages/Settings";
import Works from "./pages/Works";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import Error from "./pages/Error";
import { useContext } from "react";
import { ThemeContext } from "./theme/Theme"; 
import './styles/App.css';


function App() {
  const { theme } = useContext(ThemeContext);

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
      document.title = "Student Management";
    } else {
      document.title = "Please come back \u2665";
    }
  });

  return (
    <div className={`App bg-${theme === "light" ? "dark" : "light"}`}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <div className="d-flex flex-grow-1">
            <Sidebar />
            <main className="flex-grow-1 p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/grades" element={<Grades />} />
                <Route path="/student" element={<Student />} />
                <Route path="/works" element={<Works />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
