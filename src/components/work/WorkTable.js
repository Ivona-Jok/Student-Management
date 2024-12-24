import { useContext, useState, useEffect } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function WorkTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [works, setWorks] = useState([]);
  const [editGradeId, setEditGradeId] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

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
      },
      body: JSON.stringify({ grade: newGrade }),
    })
      .then((response) => response.json())
      .then(() => setEditGradeId(null))
      .catch((error) => {
        console.error('Error updating grade:', error);
      });
  };

  const handleGradeEdit = (workId) => {
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

  return (
    <div className={`component ${theme === "light" ? "dark" : "light"}`}> 
      <div className="table-container">
        <div className="filter-search-container">
          <input
            type="search"
            placeholder={t("search")}
            value={searchTerm}
            onChange={handleSearchChange}
            className={`form-control ${theme}`}
          />
        </div>
        <table className={`table table-${theme} table-striped`}>
          <thead>
            <tr>
              <th>#</th>
              {['title', 'author', 'description', 'link', 'date', 'grade', 'teacher'].map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSortDirection(col)}
                  style={{ cursor: 'pointer' }}
                >
                  {t(col)} {sortConfig.key === col && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedWorks.length > 0 ? (
              sortedWorks.map((work) => (
                <tr key={work.id}>
                  <td>{work.id}</td>
                  <td>{work.title}</td>
                  <td>{work.author}</td>
                  <td>
                    <div
                      className={`cell-content ${expandedRows.includes(work.id) ? 'expanded' : 'collapsed'}`}
                      onClick={() => toggleExpand(work.id)}
                    >
                      {work.description}
                    </div>
                  </td>
                  <td><a href={work.link}>View</a></td>
                  <td>{work.date}</td>
                  <td className="center">
                    <button onClick={() => handleGradeEdit(work.id)} className="grade-view">{work.grade || '-'}</button>
                    {editGradeId === work.id && (
                      <select
                        value={work.grade || ''}
                        onChange={(e) => handleGradeChange(e, work.id)}
                      >
                        {[...Array(6).keys()].map(i => <option key={i+5} value={i+5}>{i+5}</option>)}
                      </select>
                    )}
                  </td>
                  <td>{work.teacher}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">No results found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WorkTable;
