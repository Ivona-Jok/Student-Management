import { useContext, useState, useEffect } from "react";
import "../styles/Main.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import StudentTable from "../components/student/StudentTable";
import { useAuth } from "../utils/auth";

function Student() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth();

  // Stanje za studente i radove
  const [students, setStudents] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    // Ovdje bi trebalo da pozoveš API za studente i radove
    fetchStudents();
    fetchWorks();
  }, []);

  // Funkcija za učitavanje studenata
  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/users"); // Promeni putanju prema stvarnom API-ju
      const data = await response.json();
      setStudents(data); // Postavljanje podataka u stanje
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Funkcija za učitavanje radova
  const fetchWorks = async () => {
    try {
      const response = await fetch("http://localhost:5000/works"); // Promeni putanju prema stvarnom API-ju
      const data = await response.json();
      setWorks(data); // Postavljanje podataka u stanje
    } catch (error) {
      console.error("Error fetching works:", error);
    }
  };

  return (
    <div className={`main-container ${theme} student text-${theme === "light" ? "dark" : "light"}`}>
      {/* Prosleđivanje trenutnih studenata i radova kao props */}
      <StudentTable students={students} works={works} />
    </div>
  );
}

export default Student;

  