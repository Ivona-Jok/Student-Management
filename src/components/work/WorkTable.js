import { useContext, useState, useEffect, useRef } from "react";
import "../../styles/Components.css";
import "../../styles/Table.css";
import { ThemeContext } from "../../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/auth";
import WorkForm from "./WorkForm";
import UpdateWorkForm from "./UpdateWorkForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';  // Importujemo samo ikonice koje nam trebaju
import { deleteWork } from '../../utils/api';

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
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updatedWork, setUpdatedWork] = useState(null);
  const [work, setWork] = useState(null); // Držimo specifičan rad
  const [workId, setWorkId] = useState(null); // Držimo workId
  const cacheRef = useRef({});  // Ref objekat za cache radova
  

  useEffect(() => {
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const works = data.works;
        const authors = data.users.filter((user) => user.role === "student");
        const teachers = data.users.filter((user) => user.role.includes("teacher"));
  
        const worksWithAuthors = works.map((work, index) => {
          const author = authors.find((author) => author.id === work.studentId);
          const teacher = teachers.find((teacher) => teacher.id === work.teacherId);
  
          // Provera da li je author i teacher pronađen
          console.log(`Work ${work.id}:`, author, teacher);
  
          return {
            id: work.id,
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
        setWorks(worksWithAuthors); // Postavljanje radova sa autorima i učiteljima
      })
      .catch((error) => console.error("Error fetching student research papers: ", error));
  }, []);

  useEffect(() => {
    const fetchWork = async () => {
      if (workId != null) {
        // Proveri da li je već u cache-u (cacheRef je stable kroz render)
        if (cacheRef.current[workId]) {
          // Ako postoji u cache-u, samo postavi work iz cache-a
          console.log('Work found in cache:', cacheRef.current[workId]);
          setWork(cacheRef.current[workId]);
        } else {
          try {
            const response = await fetch(`http://localhost:5000/works/${workId}`);
            if (!response.ok) {
              throw new Error('Work not found');
            }
            const data = await response.json();

            // Spremi u cache (cacheRef.current) i postavi work
            cacheRef.current[workId] = data;
            setWork(data);
            console.log('Work fetched from API:', data);
          } catch (error) {
            console.error('Error fetching work:', error);
            setWork(null);  // U slučaju greške, postavi work na null
          }
        }
      }
    };

    fetchWork();
  }, [workId]); // useEffect zavisi samo od workId

  
 

 
  
 // Funkcija koja formu za dodavanje rada cini vidljivom
  const toggleForm = () => {
    setShowForm(prevState => !prevState);
  };


  const toggleUpdateForm = (work = null) => {
    setUpdatedWork(work);
    setShowUpdateForm(prevState => !prevState);
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  


  const handleGradeChange = (e, workId) => {
    //console.log('workId:', workId);  // Provjera da li je ovo trazeni ID
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


  const handleDeleteWork = async (workId) => {
    
    try {
      const user = JSON.parse(localStorage.getItem('user'));  // Uzmimo userId iz localStorage
      // Briše se work preko api funkcije deleteWork
      const response = await deleteWork(workId, user.id);
      if (response.ok) {
        // Na uspješno brisanje koriguje se state
        setWorks((prevWorks) => prevWorks.filter((work) => work.id !== workId));
        alert('Record deleted successfully.');
      } else {
        throw new Error('Failed to delete record');
      }
    } catch (error) {
      console.error('Error deleting work:', error);
      alert('Error deleting record.');
    }
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

  if (showForm) {
    return (
      <div className={`component ${theme === "light" ? "dark" : "light"}`}>
        <WorkForm />
        <button className="button-link" onClick={toggleForm}>
          {t("closeForm")} 
        </button>
      </div>
    );
  }

  

  if (showUpdateForm && updatedWork) {
    /* const workId = works.find((work) => workId === work.id); */
    return (
      <div className={`component ${theme === "light" ? "dark" : "light"}`}>
            
            <UpdateWorkForm 
            
              work={updatedWork} 
              workId={
                updatedWork?.id
              }
            />
         
        
         <button className="button-link" onClick={() => {
            toggleUpdateForm();   // Pozivanje funkcije za prikazivanje forme
          }}>
          {t("closeForm")} 
        </button>
      </div>
    );
  }


  return (
    <div className={`component ${theme === "light" ? "dark" : "light"}`}>
      <div>
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
              {['ID', 'title', 'author', 'description', 'link', 'date', 'grade', 'teacher'].map((col) => (
                <th key={col} onClick={() => toggleSortDirection(col)}>{t(col)}</th>
              ))}
              <th colSpan="2">{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((work) => (
              <tr key={work.id}>
                <th className="center" scope="row">{work.id}</th>
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
                <td>
                  <FontAwesomeIcon
                    icon={faEdit}
                    onClick={() => {
                      toggleUpdateForm(work);  // This toggles the update form
                      setWorkId(work.id);  // This sets the work ID
                    }}
                    style={{ cursor: 'pointer', color: 'orange' }}
                  />
                </td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => handleDeleteWork(work.id)}
                    style={{ cursor: 'pointer', color: 'red' }}
                  />
                </td>
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
          <div>
            <button className="button-link" onClick={toggleForm}>
              Add Work
            </button>
            {/* <button className="button-link" onClick={toggleUpdateForm}>
              Update Work
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
export default WorkTable;
