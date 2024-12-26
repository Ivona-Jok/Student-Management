import { useContext, useState } from 'react';
import '../../styles/Form.css';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../theme/Theme';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../utils/auth";
import { addWork } from '../../utils/api';

const StudentForm = () => {

  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className="wrapper">
      <div className={`form-container ${theme}`}>
        <h2 className={`title ${theme}`}> {t("student")} </h2>

          
          <form >

            <div className={`form-group ${theme}`}>
              <label htmlFor="f_name" className="label-text">First Name</label>
              <input 
                type="text" 
                className={`form-control ${theme}`}
                id="f_name" 
                value=""
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label htmlFor="l_name" className="label-text">Last Name</label>
              <input 
                type="text" 
                className={`form-control ${theme}`}
                id="l_name" 
                value=""
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label htmlFor="index" className="label-text">Index</label>
              <input 
                type="text" 
                className={`form-control ${theme}`}
                id="index" 
                value=""
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label htmlFor="index" className="label-text">Email</label>
              <input 
                type="email" 
                className={`form-control ${theme}`}
                id="email" 
                value=""
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label htmlFor="index" className="label-text">Year</label>
              <input 
                type="number" 
                className={`form-control ${theme}`}
                id="works" 
                value=""
              />
            </div>

            <div className={`form-group ${theme}`}>
              <label htmlFor="index" className="label-text">GPA</label>
              <input 
                type="number" 
                className={`form-control ${theme}`}
                id="gpa" 
                value=""
              />
            </div>
          </form>
         

      </div>
    </div>
  );
};

export default StudentForm;