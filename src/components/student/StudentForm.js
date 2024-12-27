import { useContext, useState } from 'react';
import '../../styles/Form.css';
import { ThemeContext } from '../../theme/Theme';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../utils/auth";
import { addStudent } from '../../utils/api';

const StudentForm = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user } = useAuth(); 

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    index: '',
    year: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const { firstName, lastName, email, index, year } = formData;

      const newStudent = await addStudent(firstName, lastName, email, index, year );

      setLoading(false);
      setSuccessMessage('Student data successfully added!');
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        index: '',
        year: ''
      });
    } catch (error) {
      setLoading(false);
      setError('Failed to add student data. Please try again.');
    }
  };

  return (
    <div className="wrapper">
      <div className={`form-container ${theme}`}>
        <h2 className={`title ${theme}`}>{t("student")}</h2>

        <form onSubmit={handleSubmit}>
          <div className={`form-group ${theme}`}>
            <label htmlFor="firstName" className="label-text">{t("first_name")}</label>
            <input
              type="text"
              className={`form-control ${theme}`}
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label htmlFor="lastName" className="label-text">{t("last_name")}</label>
            <input
              type="text"
              className={`form-control ${theme}`}
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label htmlFor="email" className="label-text">{t("email")}</label>
            <input
              type="email"
              className={`form-control ${theme}`}
              id="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label htmlFor="index" className="label-text">{t("index")}</label>
            <input
              type="text"
              className={`form-control ${theme}`}
              id="index"
              value={formData.index}
              onChange={handleInputChange}
            />
          </div>

          <div className={`form-group ${theme}`}>
            <label htmlFor="year" className="label-text">{t("year")}</label>
            <input
              type="number"
              className={`form-control ${theme}`}
              id="year"
              value={formData.year}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? t("loading") : t("submit")}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default StudentForm;
