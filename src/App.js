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
import { ThemeProvider } from "./theme/Theme";

function App() {
  return (
    <ThemeProvider>
      <div className="App">
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
    </ThemeProvider>
  );
}

export default App;
