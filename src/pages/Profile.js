import { useContext, useEffect, useState } from "react";
import "../styles/Main.css";
import "../styles/Profile.css";
import "../styles/Table.css";
import { ThemeContext } from "../theme/Theme";
import { useTranslation } from "react-i18next";
import { useAuth } from '../utils/auth'; 
import ProfileChart from "../components/ProfileChart";

function Profile() {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth(); 
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [worksData, setWorksData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      fetch("/db.json")
        .then((response) => response.json())
        .then((data) => {
          const loggedInUser = data.users.find((userData) => userData.token === user.token);
          if (loggedInUser) {
            setProfileData(loggedInUser);
            const studentWorks = data.works.filter((work) => work.studentId === loggedInUser.id);
            setWorksData(studentWorks);
          } else {
            setError("User not found");
          }
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch user data");
          setLoading(false);
        });
    } else {
      setError("No user logged in");
      setLoading(false);
    }
  }, [user]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const userRole = Array.isArray(profileData?.role) ? profileData?.role[0] : profileData?.role;
  
  const isAdminOrTeacher = userRole === "admin" || userRole === "teacher";

  const isStudent = userRole === "student";

  const handleDescriptionClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`main-container ${theme} grades text-${theme === "light" ? "dark" : "light"}`}>
      <div className="profile-card">
        <div className="profile-pic">
          <img
          src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg"
            alt="Profile"
          />
          <p className="role">{userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : "Student"}</p>
        </div>
        <ul className="profile-info">
          <li>
            <h4>{t("name")}</h4>
            <p className="left">{profileData?.firstName} {profileData?.lastName}</p>
          </li>
          <li>
            <h4>{t("email")}</h4>
            <p className="left">{profileData?.email}</p>
          </li>

          {!isAdminOrTeacher && (
            <>
              <li>
                <h4>{t("Index")}</h4>
                <p className="left">{profileData?.index}</p>
              </li>
              <li>
                <h4>{t("year")}</h4>
                <p className="left">1</p>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="profile-chart">
        {isStudent && <ProfileChart />}
      </div>
      <div className="profile-assigments">
        <div className="table-container">
            <table className={`table table-${theme} table-striped`}>
            <thead>
              <tr>
                <th className="center" scope="row">{t("ID")}</th>
                <th>{t("title")}</th>
                <th>{t("description")}</th>
                <th className="center">{t("link")}</th>
                <th className="center">{t("grade")}</th>
              </tr>
            </thead>
            <tbody>
              {worksData.map((work) => (
                <tr key={work.id}>
                  <td className="center">{work.id}</td>
                  <td className="title-container">{work.title}</td>
                  <td className={`description-container ${isExpanded ? 'expanded' : ''}`} onClick={handleDescriptionClick}>{work.description}</td>
                  <td className="center"><a href={work.link} target="_blank" rel="noopener noreferrer" className="button-link">{t("view")}</a></td>
                  <td className="grade-button-container center">
                    <button className="grade-button">{work.grade}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Profile;
