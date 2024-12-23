import { useContext, useEffect, useState } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function StudentTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [students, setStudents] = useState([]);

  useEffect(() => {
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
        }))
      );
    })
    .catch((error) => console.error("Error fetching students: ", error))
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const parseIndex = (index) => {
    const [num, year] = index.split("/").map(Number); 
    return { num, year };
  };

  const filteredStudents = students.filter((student) =>
    Object.keys(student).some((key) =>
      String(student[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ); 
  

  const sortedStudents = [...filteredStudents].sort((a,b) => {
    if (!sortConfig.key) return 0;
    const aIndex = parseIndex(a[sortConfig.key]);
    const bIndex = parseIndex(b[sortConfig.key]);

    if (aIndex.num < bIndex.num) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aIndex.num > bIndex.num) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    if (aIndex.year < bIndex.year) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aIndex.year > bIndex.year) {
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
              <th scope="col">{t("email")}</th>
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
                  <td>{student.email}</td>
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
