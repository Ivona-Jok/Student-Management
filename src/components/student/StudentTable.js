import { useContext, useEffect, useState, useCallback } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";
import StudentForm from "./StudentForm";
// import YearSelect from "./YearSelect";

function StudentTable({ students: initialStudents, works: initialWorks }) {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [students, setStudents] = useState(initialStudents || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [works, setWorks] = useState(initialWorks || []);
  const [averageGrade, setAverageGrade] = useState({});
  const [workCounts, setWorkCounts] = useState({});
 
  const toggleForm = () => {
    setShowForm((prevState) => !prevState);
  };

  // Fetching student data (assuming this is an example and we use local json data)
  useEffect(() => {
    if (!initialStudents || initialStudents.length === 0) {
      fetch("/db.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const studentUsers = data.users.filter((user) => user.role === "student");
          setStudents(
            studentUsers.map((user, index) => ({
              id: index + 1,
              first: user.firstName,
              last: user.lastName,
              email: user.email,
              index: user.index,
              year: user.year,
              gpa: user.gpa,
              assignments: user.assignments,
            }))
          );
        })
        .catch((error) => console.error("Error fetching students: ", error));
    }
  }, [initialStudents]);

  const fetchWorks = async () => {
    try {
      const response = await fetch("http://localhost:5000/works");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWorks(data);
    } catch (error) {
      console.error("Failed to fetch works:", error);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, []);

  function countWorksForStudents(students, works) {
    const workCounts = {};
  
    students.forEach(student => {
      const studentWorks = works.filter(work => work.studentId === student.id);
      workCounts[student.id] = studentWorks.length;
    });
  
    return workCounts;
  }

  function calculateAverageGrade(studentId, works) {
    // Filtriraj radove za datog studenta
    const studentWorks = works.filter(work => work.studentId === studentId);
  
    // Ako student nema radove, vraćamo "Rad neocijenjen"
    if (studentWorks.length === 0) {
      return "-";
    }
  
    // Računanje proseka za ocijenjene radove koristeći reduce
    const { totalGrade, validGrades, hasUnratedWork } = studentWorks.reduce(
      (acc, work) => {
        const grade = work.grade && !isNaN(parseFloat(work.grade)) ? parseFloat(work.grade) : null;
  
        if (grade === null) {
          acc.hasUnratedWork = true;
        } else {
          acc.totalGrade += grade;
          acc.validGrades += 1;
        }
  
        return acc;
      },
      { totalGrade: 0, validGrades: 0, hasUnratedWork: false } // Početni akumulator
    );
  
    // Ako nema ocijenjenih radova, vraćamo "Rad neocijenjen"
    if (validGrades === 0) {
      return "-";
    }
  
    // Računanje proseka za ocijenjene radove
    const averageGrade = totalGrade / validGrades;
  
    // Ako je bilo neocijenjenih radova, dodajemo tekst " (neocijenjen rad)"
    return hasUnratedWork ? `${averageGrade.toFixed(2)}` : averageGrade.toFixed(2);
  }
  
  
  const calculateAverageGradesForStudents = useCallback((students, works) => {
    const averageGrades = {};
  
    students.forEach(student => {
      const averageGrade = calculateAverageGrade(student.id, works);
      averageGrades[student.id] = averageGrade !== null ? averageGrade : "-";
    });
  
    return averageGrades;
  }, []); 

  useEffect(() => {
    if (students && works) {
      const counts = countWorksForStudents(students, works);
      setWorkCounts(counts);
    }
  }, [students, works]); // Kada se promene studenti ili radovi, izračunaj broj radova
  // Effect for calculating average grades when students or works change
  useEffect(() => {
    const averages = calculateAverageGradesForStudents(students, works);
    setAverageGrade(averages);
  }, [students, works, calculateAverageGradesForStudents]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Parse index to separate numbers and years
  const parseIndex = (index) => {
    if (!index || typeof index !== "string") {
      return { num: 0, year: 0 }; // Default fallback
    }
    const [num, year] = index.split("/").map(Number);
    return { num: num || 0, year: year || 0 }; // Ensure both are valid numbers
  };

  const filteredStudents = students.filter((student) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      student.first.toLowerCase().includes(lowerSearchTerm) ||
      student.last.toLowerCase().includes(lowerSearchTerm) ||
      student.index.toLowerCase().includes(lowerSearchTerm)
    );
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "index") {
      const aIndex = parseIndex(aValue);
      const bIndex = parseIndex(bValue);

      if (aIndex.num !== bIndex.num) {
        return sortConfig.direction === "asc" ? aIndex.num - bIndex.num : bIndex.num - aIndex.num;
      }
      return sortConfig.direction === "asc" ? aIndex.year - bIndex.year : bIndex.year - aIndex.year;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  const handleSort = (key, direction = "asc") => {
    setSortConfig({ key, direction });
  };

  const toggleSortDirection = (key) => {
    if (sortConfig.key === key) {
      const newDirection = sortConfig.direction === "asc" ? "desc" : "asc";
      handleSort(key, newDirection);
    } else {
      handleSort(key, "asc");
    }
  };

  const renderSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleStudentsPerPageChange = (e) => {
    setStudentsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (showForm) {
    return (
      <div className={`component ${theme === "light" ? "dark" : "light"}`}>
        <StudentForm />
        <button className="button-link" onClick={toggleForm}>
          {t("closeForm")}
        </button>
      </div>
    );
  }

 


  return (
    <div className={`component ${theme === "light" ? "dark" : "light"}`}>
      <div className="table-container">
        <div className="filter-search-container">
          <div className={`search ${theme}`}>
            <input
              type="search"
              placeholder={t("search")}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`form-control ${theme}`}
              aria-label="Search"
            />
          </div>
          <div className="filter">
            <select
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                handleSort(key, direction);
              }}
              className={`form-select ${theme}`}
            >
              <option value="">{t("sort_by")}</option>
              <option value="first-asc">{t("f_name")} (A-Z)</option>
              <option value="first-desc">{t("f_name")} (Z-A)</option>
              <option value="last-asc">{t("l_name")} (A-Z)</option>
              <option value="last-desc">{t("l_name")} (Z-A)</option>
              <option value="index-asc">Index (Ascending)</option>
              <option value="index-desc">Index (Descending)</option>
            </select>
          </div>
        </div>
        <table className={`table table-${theme} table-striped`}>
          <thead>
            <tr>
              <th scope="col" className="center">ID</th>
              <th scope="col" onClick={() => toggleSortDirection("first")}>
                {t("f_name")} {renderSortArrow("first")}
              </th>
              <th scope="col" onClick={() => toggleSortDirection("last")}>
                {t("l_name")} {renderSortArrow("last")}
              </th>
              <th scope="col" onClick={() => toggleSortDirection("index")}>
                Index {renderSortArrow("index")}
              </th>
              <th scope="col">{t("email")}</th>
              <th scope="col">{t("year")}</th>
              <th scope="col">GPA</th>
              <th scope="col">{t("works")}</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((student) => (
                <tr key={student.id}>
                  <th className="center" scope="row">{student.id}</th>
                  <td>{student.first}</td>
                  <td>{student.last}</td>
                  <td className="center">{student.index}</td>
                  <td>{student.email}</td>
                  <td className="center">{student.year}</td>
                  <td className="center">{averageGrade[student.id]}</td>
                  <td className="center">{workCounts[student.id] || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-container">
          <div className="students-per-page">
            <label>{t("display")}:</label>
            <select value={studentsPerPage} onChange={handleStudentsPerPageChange} className={`form-select ${theme}`}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`page-btn ${currentPage === index + 1 ? "active" : ""}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div>
            <button className="button-link" onClick={toggleForm}>
              Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentTable;
