import { useContext, useState } from 'react';
import '../../styles/Form.css';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../theme/Theme';
import { useTranslation } from 'react-i18next';
/* import { useAuth } from '../utils/auth'; */
import { useAuth } from "../../utils/auth";
import { addWork } from '../../utils/api';

const WorkForm = () => {

  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredLink, setEnteredLink] = useState('');
  const [inputTouched, setInputTouched] = useState({
    title: false,
    description: false,
    link: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const enteredTitleIsValid = enteredTitle.length > 1; 
  const enteredTitleIsInvalid = !enteredTitleIsValid && inputTouched.title;

  const enteredDescriptionIsValid = enteredDescription.length > 1; 
  const enteredDescriptionIsInvalid = !enteredDescriptionIsValid && inputTouched.description;

  const enteredLinkIsUrl = /^(https?:\/\/)/;
  const enteredLinkIsValid = enteredLink.length > 1 && enteredLinkIsUrl.test(enteredLink) ; 
  const enteredLinkIsInvalid = !enteredLinkIsValid && !enteredLinkIsUrl.test(enteredLink) && inputTouched.link;

  const formIsValid = enteredTitleIsValid && enteredDescriptionIsValid && enteredLinkIsValid;

  const titleInputChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  const descriptionInputChangeHandler = (event) => {
    setEnteredDescription(event.target.value);
  };

  const linkInputChangeHandler = (event) => {
    setEnteredLink(event.target.value);
  };

  const titleInputBlurHandler = () => {
    if (enteredTitle.length < 1) {
      setError("Morate popuniti polje za naslov."); 
    } else {
      setError(""); 
    }
    setInputTouched((prev) => ({ ...prev, title: true }));
  };

  const descriptionInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, description: true }));
  };

  const linkInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, link: true }));
  };

  const renderErrorMessage = (isInvalid, errorMessage) => {
    return isInvalid && <p className="error-text">{errorMessage}</p>;
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!enteredTitleIsValid || !enteredDescriptionIsValid || !enteredLinkIsValid ) {
      setIsLoading(false);
      return;
    }

    try {
        // Dodaj trenutni datum
        const currentDate = new Date().toISOString();
        const { work: newWork } = await addWork(
          enteredTitle,
          enteredDescription,
          enteredLink,
          user.id,
          currentDate
        );
    
      console.log('Work Added:', newWork);
      navigate('/works');
      
      setEnteredTitle('');
      setEnteredDescription('');
      setInputTouched({ title: false, description: false, link: false });
    } catch (error) {
        console.error('Adding new work failed:', error.message);
        alert(error.message || 'Adding new work failed.');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="wrapper">
      <div className={`form-container ${theme}`}>
        <h2 className={`title ${theme}`}> {t("add work")} </h2>
        <form onSubmit={formSubmissionHandler}>
          <div className={`form-group ${theme} ${enteredTitleIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="title" className="label-text"> {t("title")} </label>
            <input 
              type="text" 
              className={`form-control ${theme}`} 
              id="title" 
             
              onChange={titleInputChangeHandler}
              onBlur={titleInputBlurHandler}
              value={enteredTitle}
            />
            <small id="emailHelp" className="form-text text-muted"> {t("title_desc")} </small>
            {renderErrorMessage(enteredTitleIsInvalid, 'Please enter a title.')}
          </div>
          
          <div className={`form-group ${theme} ${enteredDescriptionIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="description" className="label-text"> {t("description")} </label>
            <textarea 
              name="message" 
              rows="4" 
              cols="50" 
              placeholder="Enter description here..."
              className={`form-control ${theme}`}
              onChange={descriptionInputChangeHandler}
              onBlur={descriptionInputBlurHandler}
              value={enteredDescription}
              id="description" 
              >
            </textarea>
            <small id="passwordHelpBlock" className={`form-text text-muted ${theme === "light" ? "dark" : "light"}`}>
              {t("desc_desc")}
            </small>
            {renderErrorMessage(enteredDescriptionIsInvalid, `Please enter description. ${error}`)}
          </div>

          <div className={`form-group ${theme} ${enteredLinkIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="link" className="label-text"> {t("link")} </label>
            <input 
              type="link" 
              className={`form-control ${theme}`}
              id="link" 
              onChange={linkInputChangeHandler}
              onBlur={linkInputBlurHandler}
              value={enteredLink}
            />
            <small id="passwordHelpBlock" className={`form-text text-muted ${theme === "light" ? "dark" : "light"}`}>
              {t("link_desc")}
            </small>
            {renderErrorMessage(enteredLinkIsInvalid, `Please enter link to your paper. ${error}`)}
          </div>
          
          <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">
            {isLoading ? 'Adding in...' : 'Add'}
            
          </button>

        </form>
      </div>
    </div>
  );
};

export default WorkForm;