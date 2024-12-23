import { useContext, useState } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function StudentTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const students = [
    { id: 1, first: "Mark", last: "Otto", index: "53/22", year: 1, gpa: 7.8, assignments: 2 },
    { id: 2, first: "Jacob", last: "Thornton", index: "119/23", year: 2, gpa: 9, assignments: 5 },
    { id: 3, first: "Larry", last: "the Bird", index: "12/20", year: 3, gpa: 6.5, assignments: 6 },
    { id: 4, first: "Anna", last: "Smith", index: "22/21", year: 4, gpa: 8.2, assignments: 4 },
    { id: 5, first: "Mike", last: "Ross", index: "45/19", year: 5, gpa: 9.1, assignments: 3 },
  ];

  const filteredStudents = students.filter((student) =>
    Object.keys(student).some((key) => {
      const value = student[key];
      if (key === 'index') {
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );
  

  const sortedStudents = [...filteredStudents].sort((a,b) => {
    if (!sortConfig.key) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];

    if (valueA < valueB) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (valueA > valueB) {
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

  return (
    <div className={`component ${theme === "light" ? "dark" : "light"}`}>
      <div className="table-container">
        <div className="filter-search-container">
          <div className="filter">
            <select
              onChange={(e) => {
                const [key, direction] = e.target.value.split("-");
                handleSort(key, direction);
              }}
              className={`form-select ${theme}`}
            >
              <option value="">Sort by</option>
              <option value="first-asc"> {t("f_name")} (A-Z)</option>
              <option value="first-desc"> {t("f_name")} (Z-A)</option>
              <option value="last-asc"> {t("l_name")} (A-Z)</option>
              <option value="last-desc"> {t("l_name")} (Z-A)</option>
              <option value="index-asc">Index (Ascending)</option>
              <option value="index-desc">Index (Descending)</option>
            </select>
          </div>
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
        </div>
        <table className={`table table-${theme} table-striped`}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("first")}
                style={{ cursor: "pointer" }}
              >
                {t("f_name")} {sortConfig.key === "first" && (sortConfig.direction === "asc" ? "" : "")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("last")}
                style={{ cursor: "pointer" }}
              >
                {t("l_name")} {sortConfig.key === "last" && (sortConfig.direction === "asc" ? "" : "")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("index")}
                style={{ cursor: "pointer" }}
              >
                Index {sortConfig.key === "index" && (sortConfig.direction === "asc" ? "" : "")}
              </th>
              <th scope="col">{t("year")}</th>
              <th scope="col">GPA</th>
              <th scope="col">{t("works")}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length > 0 ? (
              sortedStudents.map((student) => (
                <tr key={student.id}>
                  <th scope="row">{student.id}</th>
                  <td>{student.first}</td>
                  <td>{student.last}</td>
                  <td>{student.index}</td>
                  <td>{student.year}</td>
                  <td>{student.gpa}</td>
                  <td>{student.assignments}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No matching results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
