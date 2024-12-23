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
  const [editGradeId, setEditGradeId] = useState(null);  // Pratimo koji rad je editovan ocjenom
 

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
  
        // Mapiiramo sve korisnike
        const worksWithAuthors = studentWorks.map((work, index) => {
          // Pronalazimo autora i profesora
          const author = authors.find((author) => author.id === work.studentId);
          const teacher = teachers.find((teacher) => teacher.id === work.teacherId);
  
          // Provjeravamo da li smo dobili podatke o autoru i profesoru
          const authorInfo = author ? { name: `${author.firstName} ${author.lastName}`, email: author.email } : null;
          const teacherInfo = teacher ? { name: `${teacher.firstName} ${teacher.lastName}`, email: teacher.email } : null;

          return {
            id: index + 1,
            title: work.title,
            description: work.description,
            link: work.link,
            studentId: work.studentId,
            author: authorInfo,
            grade: work.grade,
            teacher: teacherInfo,
            date: work.date,
          };
        });
  
        setWorks(worksWithAuthors);
      })
      .catch((error) => console.error("Error fetching student research papers: ", error));
  }, []);  

// Funkcija za ažuriranje ocjene
const handleGradeChange = (e, workId) => {
  const newGrade = e.target.value;

  // Ažuriraj ocjenu lokalno
  setWorks((prevWorks) =>
    prevWorks.map((work) =>
      work.id === workId ? { ...work, grade: newGrade } : work
    )
  );

  // Ažuriraj ocjenu u bazu podataka
  fetch(`http://localhost:5000/works/${workId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ grade: newGrade }), // Šalje se korigovana ocjena u bazu podataka
  })
  .then((response) => response.json())
  .then((data) => {
    console.log('Grade updated successfully:', data);
    setEditGradeId(null); // Zatvori padajući meni nakon odabira ocjene
  })
  .catch((error) => {
    console.error('Error updating grade:', error);
    // Ako ne uspije ažuriranje vrati ocjenu koja je bila prije ovog pokušaja ažuriranja
    setWorks((prevWorks) =>
      prevWorks.map((work) =>
        work.id === workId ? { ...work, grade: null } : work
      )
    );
  });
};

  const handleGradeEdit = (workId) => {
    setEditGradeId(workId); 
  };

  const filteredWorks = works.filter((work) =>
    Object.keys(work).some((key) => {
      const value = work[key];
      if (key === 'index') {
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      }
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );
  
  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (!sortConfig.key) return 0;
  
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
  
    
    if (sortConfig.key === "link") {
      const [numA1, numA2] = valueA.split("/").map((v) => parseFloat(v));
      const [numB1, numB2] = valueB.split("/").map((v) => parseFloat(v));
  
      
      if (numA1 < numB1 || (numA1 === numB1 && numA2 < numB2)) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (numA1 > numB1 || (numA1 === numB1 && numA2 > numB2)) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
    } else {
      
      const isNumericA = !isNaN(valueA) && valueA !== null && valueA !== "";
      const isNumericB = !isNaN(valueB) && valueB !== null && valueB !== "";
  
      if (isNumericA && isNumericB) {
        
        const numValueA = parseFloat(valueA);
        const numValueB = parseFloat(valueB);
  
        if (numValueA < numValueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (numValueA > numValueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      } else {
        
        const stringValueA = String(valueA).toLowerCase();
        const stringValueB = String(valueB).toLowerCase();
  
        if (stringValueA < stringValueB) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (stringValueA > stringValueB) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
      }
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
              <option value="">{t("sort_by")}</option>
              <option value="first-asc"> {t("title")} (A-Z)</option>
              <option value="first-desc"> {t("title")} (Z-A)</option>
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
                onClick={() => toggleSortDirection("title")}
                style={{ cursor: "pointer" }}
              >
                {t("title")} {sortConfig.key === "title" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("author")}
                style={{ cursor: "pointer" }}
              >
                {t("author")} {sortConfig.key === "author" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("description")}
                style={{ cursor: "pointer" }}
              >
                {t("description")} {sortConfig.key === "description" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("link")}
                style={{ cursor: "pointer" }}
              >
                Link {sortConfig.key === "link" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("date")}
                style={{ cursor: "pointer" }}
              >
                {t("date")} {sortConfig.key === "date" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("grade")}
                style={{ cursor: "pointer" }}
              >
                {t("grade")} {sortConfig.key === "grade" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
              <th
                scope="col"
                onClick={() => toggleSortDirection("teacher")}
                style={{ cursor: "pointer" }}
              >
                {t("teacher")} {sortConfig.key === "teacher" && (sortConfig.direction === "asc" ? " ↑" : " ↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedWorks.length > 0 ? (
              sortedWorks.map((work) => (
                <tr key={work.id}>
                  <th scope="row">{work.id}</th>
                  <td>{work.title}</td>
                  <td>{work.author ? work.author.name : "Unknown"}</td>
                  <td>{work.description}</td>
                  <td><a href={work.link}>Pogledaj rad</a></td>
                  <td>{work.date}</td>
                  <td>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleGradeEdit(work.id); // Pokreni funkciju za editovanje ocjene
                    }}
                    className="grade-button"
                  >
                    {work.grade ? work.grade : "Bez ocjene"}
                  </button>
                  {editGradeId === work.id && (
                      <select
                      value={work.grade || ""}
                        onChange={(e) => handleGradeChange(e, work.id)}
                      >
                        <option value="">Bez ocjene</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                    )}
                  </td>
                  <td>{work.teacher ? work.teacher.name : "Unknown"}</td>
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

export default WorkTable;
