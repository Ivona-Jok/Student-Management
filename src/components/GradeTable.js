import React, { useState, useEffect, useContext } from "react";
import "../styles/Components.css";
import "../styles/Table.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";

function GradeTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [works, setWorks] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editGradeId, setEditGradeId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [worksPerPage, setWorksPerPage] = useState(10);
  const [gradeSortDirection, setGradeSortDirection] = useState("asc");

  const getStudentName = (studentId) => {
    const student = users.find((user) =>
      user.id === studentId && user.role.includes("student")
    );
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getTeacherName = (teacherId) => {
    const teacher = users.find((user) =>
      user.id === teacherId && user.role.includes("teacher")
    );
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown Teacher";
  };

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched data:", data);
        const studentWorks = data.works;
        const authors = data.users.filter((user) => user.role.includes("student"));
        const teachers = data.users.filter((user) => user.role.includes("teacher"));

        const worksWithAuthors = studentWorks.map((work, index) => {
          const author = authors.find((author) => Number(author.id) === Number(work.studentId));
          const teacher = teachers.find((teacher) => Number(teacher.id) === Number(work.teacherId));

          return {
            id: index + 1,
            title: work.title,
            description: work.description,
            link: work.link,
            studentId: work.studentId,
            author: author ? `${author.firstName} ${author.lastName}` : "Unknown",
            grade: work.grade,
            teacher: teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unknown",
            date: work.date,
          };
        });

        setWorks(worksWithAuthors);
        setUsers(data.users);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const toggleExpand = (id) => {
    setExpandedRows((prevExpandedRows) => {
      if (prevExpandedRows.includes(id)) {
        return prevExpandedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevExpandedRows, id];
      }
    });
  };

  const handleGradeEdit = (id) => {
    setEditGradeId((prevId) => (prevId === id ? null : id));
  };

  const handleGradeChange = (e, id) => {
    const updatedGrade = e.target.value;
    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.id === id ? { ...work, grade: updatedGrade } : work
      )
    );
  };

  const filteredWorks = works.filter((work) => {
    const studentName = getStudentName(work.studentId).toLowerCase();
    const title = work.title.toLowerCase();
    return (
      (work.grade && work.grade.trim() !== "") &&
      (studentName.includes(searchTerm.toLowerCase()) || title.includes(searchTerm.toLowerCase()))
    );
  });

    const toggleSortDirection = (value) => {
      setSelectedFilter(value);
      if (value === "grade_ascending") {
        setGradeSortDirection("asc");
      } else if (value === "grade_descending") {
        setGradeSortDirection("desc");
      }
    };
    
    const sortedWorks = filteredWorks.sort((a, b) => {
      if (selectedFilter === "student") {
        return a.author.localeCompare(b.author); 
      } else if (selectedFilter === "grade_ascending" || selectedFilter === "grade_descending") {
        const gradeA = a.grade ? Number(a.grade) : -1;
        const gradeB = b.grade ? Number(b.grade) : -1;
        return gradeSortDirection === "asc" ? gradeA - gradeB : gradeB - gradeA;
      } else if (selectedFilter === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
    

  const totalPages = Math.ceil(sortedWorks.length / worksPerPage);

  const currentWorks = sortedWorks.slice(
    (currentPage - 1) * worksPerPage,
    currentPage * worksPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleStudentsPerPageChange = (e) => {
    setWorksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={`text-${theme === "light" ? "dark" : "light"}`}>
      <div className={`component ${theme === "light" ? "dark" : "light"}`}>
        <div className="table-container">
          <div className="filter-search-container">
            <div className="search">
              <input
                type="search"
                placeholder={t("search")}
                value={searchTerm}
                onChange={handleSearchChange}
                className={`form-control ${theme}`}
              />
            </div>
            <div className="filter">
              <select
                onChange={(e) => toggleSortDirection(e.target.value)}
                className={`form-select ${theme === "light" ? "dark" : "light"}`}
              >
                <option value="">{t("sort_by")}</option>
                {['student', 'title', 'grade_descending', 'grade_ascending'].map((col) => (
                  <option key={col} value={col}>{t(col)}</option>
                ))}
              </select>
            </div>
          </div>
          <table className={`table table-${theme} table-striped`}>
            <thead>
              <tr>
                <th className="center">{t("ID")}</th>
                <th>{t("student")}</th>
                <th>{t("assignments")}</th>
                <th>{t("grade")}</th>
                <th>{t("teacher")}</th>
              </tr>
            </thead>
            <tbody>
              {currentWorks.map((work) => (
                <tr key={work.id}>
                  <th className="center" scope="row">{work.id}</th>
                  <td>{work.author}</td>
                  <td>
                    <div
                      className={`cell-content ${expandedRows.includes(work.id) ? "expanded" : "collapsed"}`}
                      onClick={() => toggleExpand(work.id)}
                    >
                      {work.title}
                    </div>
                    {expandedRows.includes(work.id) && (
                      <div className="work-description">
                        {work.description}
                      </div>
                    )}
                  </td>
                  <td className="center">
                    <button onClick={() => handleGradeEdit(work.id)} className="grade-button">
                      {work.grade || "-"}
                    </button>
                    {editGradeId === work.id && (
                      <select value={work.grade || ""} onChange={(e) => handleGradeChange(e, work.id)}>
                        <option value="">-</option>
                        {[...Array(6).keys()].map((i) => (
                          <option key={i + 6} value={i + 6}>
                            {i + 6}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>{work.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination-container">
            <div className="students-per-page">
              <label className={`display ${theme}`}>{t("display")}:</label>
              <select value={worksPerPage} onChange={handleStudentsPerPageChange} className={`form-select ${theme === "light" ? "dark" : "light"}`}
              >
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default GradeTable;
