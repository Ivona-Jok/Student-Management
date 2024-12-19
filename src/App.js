import './styles/App.css';
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

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <Sidebar />
        <main>
          <div className="d-flex flex-column min-vh-100">
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
          </div>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
