import { useContext, useState, useEffect } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth";
import WorkForm from "./WorkForm";

function WorkTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth(); 

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [works, setWorks] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editGradeId, setEditGradeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);  
  const [worksPerPage, setWorksPerPage] = useState(10);  
  const [showForm, setShowForm] = useState(false);

  // Step 2: Function to toggle the visibility of the WorkForm
  const toggleForm = () => {
    setShowForm(prevState => !prevState);
  };

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
        console.log("Fetched works:", data);
        console.log(typeof "2f2d"); 
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
    console.log('workId:', workId);  // Check if this is the expected ID
    if (!user?.role.includes("teacher")) {
      console.log('Access denied: Only teachers can update grades.');
      return;
    }

    const newGrade = e.target.value;
    const teacherId = user.id;

    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.id === workId ? { ...work, grade: newGrade, teacherId: teacherId } : work
      )
    );

    fetch(`http://localhost:5000/works/${workId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`, 
      },
      body: JSON.stringify({ grade: newGrade, teacherId: teacherId }),
      body: JSON.stringify({ grade: newGrade, teacherId: teacherId }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
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
        <button className="button-link" onClick={toggleForm}>{showForm ? `${t("closeForm")}` : `${t("addForm")}`}</button>
          {showForm && <WorkForm />}
        <table className={`table table-${theme} table-striped`}>
          <thead>
            <tr>
              {['ID', 'title', 'author', 'description', 'link', 'date', 'grade', 'teacher'].map((col) => (
                <th key={col} onClick={() => toggleSortDirection(col)}>{t(col)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((work) => (
              console.log('work.id', work.id),
              <tr key={work.id}>
                <td className="center">{work.id}</td>
                <td>
                  <div className={`cell-content ${expandedRows.includes(work.id) ? 'expanded' : 'collapsed'}`} onClick={() => toggleExpand(work.id)} >
                    {work.title}
                  </div>
                </td>
                <td>{work.author}</td>
                <td>
                  <div className={`cell-content ${expandedRows.includes(work.id) ? 'expanded' : 'collapsed'}`} onClick={() => toggleExpand(work.id)} >
                    {work.description}
                  </div>
                </td>
                <td className="center"><a href={work.link} target="_blank" rel="noopener noreferrer" className="button-link">{t("view")}</a></td>
                <td className="center">{work.date}</td>
                <td className="grade-button-container center">
                  <button onClick={() => handleGradeEdit(work.id)} className="grade-button">{work.grade || '-'}</button>
                  {editGradeId === work.id && (
                      <select value={work.grade || ''} onChange={(e) => handleGradeChange(e, work.id)} >
                        <option value="">-</option>
                        {[...Array(6).keys()].map(i => <option key={i+6} value={i+6}>{i+6}</option>)}
                      </select>)}
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
