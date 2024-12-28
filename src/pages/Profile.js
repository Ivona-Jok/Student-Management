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
            src="data:image/jpeg;base64,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"
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
