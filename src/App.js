import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import React, { useContext } from "react";
import { ThemeContext } from "./theme/Theme"; 
import './styles/App.css';
import { useAuth } from './utils/auth';
 

function App() {
  const { theme } = useContext(ThemeContext);
  const { user } = useAuth();
  const location = useLocation();

  const isRegisterPage = location.pathname === "/register";
  const isLoginPage = location.pathname === "/login";

  const PrivateRoute = ({ element }) => {
    return user ? element : <Navigate to="/login" />;
  };


  const PublicRoute = ({ element }) => {
    return user ? <Navigate to="/" /> : element;
  };


  return (
<div className={`App bg-${theme}`}>
      <div className="d-flex flex-column min-vh-100">
        {!isRegisterPage && !isLoginPage  && <Header />}
        <div className="d-flex flex-grow-1">
        {!isRegisterPage && !isLoginPage  && <Sidebar />}
          <main className="flex-grow-1 p-4">
            <Routes>
              <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/grades" element={<PrivateRoute element={<Grades />} />} />
              <Route path="/student" element={<PrivateRoute element={<Student />} />} />
              <Route path="/works" element={<PrivateRoute element={<Works />} />} />
              <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
              <Route path="/login" element={<PublicRoute element={<Login />} />} />
              {!user && (
                <Route path="/register" element={<Register />} />
              )}
              
              <Route path="*" element={<Error />} />
            </Routes>
          </main>
        </div>
        {!isRegisterPage && !isLoginPage && <Footer />}
      </div>
    </div>
  );
}
export default App;       
