import { useContext, useState } from 'react';
import '../../styles/Form.css';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../theme/Theme';
import { useTranslation } from 'react-i18next';
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
  const [errorMessages, setErrorMessages] = useState({
    title: "",
    description: "",
    link: ""
  });
  const [isLoading, setIsLoading] = useState(false);

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
    setInputTouched((prev) => ({ ...prev, title: true }));
    if (enteredTitle.length < 1) {
      setErrorMessages((prev) => ({
        ...prev,
        title: "Polje za naslov mora biti popunjeno."
      }));
    } else {
      setErrorMessages((prev) => ({ ...prev, title: "" }));
    }
  };

  const descriptionInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, description: true }));
    if (enteredDescription.length < 1) {
      setErrorMessages((prev) => ({
        ...prev,
        description: "Polje za opis mora biti popunjeno."
      }));
    } else {
      setErrorMessages((prev) => ({ ...prev, description: "" }));
    }
  };

  const linkInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, link: true }));
    if (enteredLink.length < 1) {
      setErrorMessages((prev) => ({
        ...prev,
        link: "Polje za putanju do rada mora biti popunjeno."
      }));
    } else if (!enteredLinkIsUrl.test(enteredLink)) {
      setErrorMessages((prev) => ({
        ...prev,
        link: "URL mora da počinje sa http:// ili sa https://."
      }));
    } else {
      setErrorMessages((prev) => ({ ...prev, link: "" }));
    }
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
        const currentDate = new Date().toISOString();
        const { work: newWork } = await addWork(
          enteredTitle,
          enteredDescription,
          enteredLink,
          Number(user.id),
          currentDate
        );
    
      console.log('Work Added:', newWork);
      navigate('/works');
      
      setEnteredTitle('');
      setEnteredDescription('');
      setEnteredLink('');
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
        <h2 className={`title ${theme}`}> {t("addWork")} </h2>
        <form onSubmit={formSubmissionHandler}>

          <div className={`form-group ${theme} ${enteredTitleIsInvalid ? 'invalid' : ''}`}>

            <label htmlFor="title" className="label-text"> {t("title")} </label>
            <input 
              type="text" 
              className={`form-control ${theme}`} 
              id="title" 
              placeholder={t("placeholderTitle")}
              onChange={titleInputChangeHandler}
              onBlur={titleInputBlurHandler}
              value={enteredTitle}
            />
            
            {renderErrorMessage(enteredTitleIsInvalid, `${t("enterTitle")} ${errorMessages.title}`)}

          </div>
          
          <div className={`form-group ${theme} ${enteredDescriptionIsInvalid ? 'invalid' : ''}`}>

            <label htmlFor="description" className="label-text"> {t("description")} </label>
            <textarea 
              name="description" 
              rows="4" 
              cols="50" 
              placeholder={t("placeholderDescription")}
              className={`form-control ${theme}`}
              onChange={descriptionInputChangeHandler}
              onBlur={descriptionInputBlurHandler}
              value={enteredDescription}
              id="description" 
              >
            </textarea>
            
            {renderErrorMessage(enteredDescriptionIsInvalid, `${t("enterDescription")} ${errorMessages.description}`)}

          </div>

          <div className={`form-group ${theme} ${enteredLinkIsInvalid ? 'invalid' : ''}`}>

            <label htmlFor="link" className="label-text"> {t("link")} </label>
            <input 
              type="link" 
              placeholder={t("placeholderLink")}
              className={`form-control ${theme}`}
              id="link" 
              onChange={linkInputChangeHandler}
              onBlur={linkInputBlurHandler}
              value={enteredLink}
            />
            
            {renderErrorMessage(enteredLinkIsInvalid, `${t("enterLink")} ${errorMessages.link}`)}

          </div>
          
          <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">
            {isLoading ? "Adding in..." : `${t("add")}`}
          </button>

        </form>
      </div>
    </div>
  );
};

export default WorkForm;