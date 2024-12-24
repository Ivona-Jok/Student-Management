import { useContext, useState, useEffect } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth";

function WorkTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth();  // Get user from auth context

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [works, setWorks] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editGradeId, setEditGradeId] = useState(null);  // Initialize state for editGradeId
  const [currentPage, setCurrentPage] = useState(1);  // Initialize state for currentPage
  const [worksPerPage, setWorksPerPage] = useState(10);  // Initialize state for worksPerPage

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const studentWorks = data.works;
        const authors = data.users.filter((user) => user.role === "student");
        const teachers = data.users.filter((user) => user.role.includes("teacher"));

        const worksWithAuthors = studentWorks.map((work, index) => {
          const author = authors.find((author) => author.id === work.studentId);
          const teacher = teachers.find((teacher) => teacher.id === work.teacherId);

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
      })
      .catch((error) => console.error("Error fetching student research papers: ", error));
  }, []);

  const handleGradeChange = (e, workId) => {
    if (!user?.role.includes("teacher")) {
      console.log('Access denied: Only teachers can update grades.');
      return;
    }

    const newGrade = e.target.value;

    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.id === workId ? { ...work, grade: newGrade } : work
      )
    );

    fetch(`http://localhost:5000/works/${workId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`, 
      },
      body: JSON.stringify({ grade: newGrade }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Grade updated successfully:', data);
        setEditGradeId(null); 
      })
      .catch((error) => {
        console.error('Error updating grade:', error);
        setWorks((prevWorks) =>
          prevWorks.map((work) =>
            work.id === workId ? { ...work, grade: null } : work
          )
        );
      });
  };

  const handleGradeEdit = (workId) => {
    if (!user?.role.includes("teacher")) {
      console.log('Access denied: Only teachers can edit grades.');
      return;
    }
    setEditGradeId(workId);
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSort = (key, direction = "asc") => {
    setSortConfig({ key, direction });
  };

  const toggleSortDirection = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredWorks = works.filter((work) =>
    Object.keys(work).some((key) =>
      String(work[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    return sortConfig.direction === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  const indexOfLastStudent = currentPage * worksPerPage;
  const indexOfFirstStudent = indexOfLastStudent - worksPerPage;
  const currentStudents = sortedWorks.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(sortedWorks.length / worksPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleStudentsPerPageChange = (e) => {
    setWorksPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  return (
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
            <select onChange={(e) => toggleSortDirection(e.target.value)} className={`form-select ${theme}`}>
              <option value="">{t("sort_by")}</option>
              {['title', 'author', 'date', 'grade'].map((col) => (
                <option key={col} value={col}>{t(col)}</option>
              ))}
            </select>
          </div>
        </div>
        <table className={`table table-${theme} table-striped`}>
          <thead>
            <tr>
              {['id', 'title', 'author', 'description', 'link', 'date', 'grade', 'teacher'].map((col) => (
                <th key={col} onClick={() => toggleSortDirection(col)}>{t(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((work) => (
              <tr key={work.id}>
                <td>{work.id}</td>
                <td>{work.title}</td>
                <td>{work.author}</td>
                <td onClick={() => toggleExpand(work.id)} className="cell-content">{work.description}</td>
                <td><a href={work.link}>{t("view")}</a></td>
                <td>{work.date}</td>
                <td>
                  <button onClick={() => handleGradeEdit(work.id)} className="grade-view">{work.grade || '-'}</button>
                </td>
                <td>{work.teacher}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-container">
          <div className="students-per-page">
            <label>{t("display")}:</label>
            <select value={worksPerPage} onChange={handleStudentsPerPageChange} className={`form-select ${theme}`} >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <button key={index + 1} onClick={() => handlePageChange(index + 1)} className={`page-btn ${currentPage === index + 1 ? "active" : ""}`} >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkTable;
