import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from './components/Sidebar';
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import Student from "./pages/Student";
import Settings from "./pages/Settings";
import Works from "./pages/Works";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Error from "./pages/Error";
import { useContext } from "react";
import { ThemeContext } from "./theme/Theme"; 
import './styles/App.css';
import { useAuth } from './utils/auth';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`App bg-${theme}`}>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <div className="d-flex flex-grow-1">
            <Sidebar />
            <main className="flex-grow-1 p-4">
              <Routes>
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/grades" element={user ? <Grades /> : <Navigate to="/login" />} />
                <Route path="/student" element={user ? <Student /> : <Navigate to="/login" />} />
                <Route path="/works" element={user ? <Works /> : <Navigate to="/login" />} />
                <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
    </div>
  );
}

export default App;
