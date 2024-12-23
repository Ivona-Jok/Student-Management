import { useContext, useState } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";

function StudentTable() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const students = [
    { id: 1, first: "Mark", last: "Otto", index: "53/22", year: 1, gpa: 7.8, assignments: 2 },
    { id: 2, first: "Jacob", last: "Thornton", index: "119/23", year: 2, gpa: 9, assignments: 5 },
    { id: 3, first: "Larry", last: "the Bird", index: "12/20", year: 3, gpa: 6.5, assignments: 6 },
    { id: 4, first: "Anna", last: "Smith", index: "22/21", year: 4, gpa: 8.2, assignments: 4 },
    { id: 5, first: "Mike", last: "Ross", index: "45/19", year: 5, gpa: 9.1, assignments: 3 },
  ];

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className={`component ${theme === "light" ? "dark" : "light"}`}>
      <div className="table-container">
        <div className="filter-search-container">
          <div className="filter">Filter</div>
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
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Index</th>
              <th scope="col">Year</th>
              <th scope="col">GPA</th>
              <th scope="col">Assignments</th>
            </tr>
          </thead>
          <tbody>
          {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
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
