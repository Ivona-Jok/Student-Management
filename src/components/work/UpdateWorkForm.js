import { useContext, useState, useEffect } from 'react';
import '../../styles/Form.css';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../theme/Theme';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../utils/auth";
import { updateWork } from '../../utils/api';

const UpdateWorkForm = ({workId}) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const { user } = useAuth(); 
  const [error, setError] = useState(null);
  /* const [updatedWork, setUpdatedWork] = useState(null); */
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


  useEffect(() => {
    const fetchWorkData = async () => {
      if (!workId) {
        setError('Work ID is required');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/works/${workId}`);
        console.log("Ovo je ID UpdateWorkForm Fetch:", workId);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch work data');
        }

        setWork(data);
        setEnteredTitle(data.title);
        setEnteredDescription(data.description);
        setEnteredLink(data.link);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkData();
  }, [workId]);


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




 /*   const updateFormSubmissionHandler = async (event) => {
     event.preventDefault();
     setIsLoading(true);
 
     if (!enteredTitleIsValid || !enteredDescriptionIsValid || !enteredLinkIsValid ) {
       setIsLoading(false);
       return;
     }
 
     try {
         const currentDate = new Date().toISOString();
         const { work: updatedWork } = await updateWork(
           enteredTitle,
           enteredDescription,
           enteredLink,
           user.id,
           currentDate
         );
     
       console.log('Work updated:', updatedWork);
       navigate('/works');
       
       setEnteredTitle('');
       setEnteredDescription('');
       setEnteredLink('');
       setInputTouched({ title: false, description: false, link: false });
     } catch (error) {
         console.error('Updating work failed:', error.message);
         alert(error.message || 'Updating work failed.');
       } finally {
         setIsLoading(false);
       }
   }; */

  // Funkcija za ažuriranje rada
  const updateFormSubmissionHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!enteredTitleIsValid || !enteredDescriptionIsValid || !enteredLinkIsValid ) {
      setIsLoading(false);
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      const userId = localStorage.getItem('userId');
      const updatedWork = await updateWork (
        work.id,
        enteredTitle,           
        enteredDescription, 
        enteredLink, 
        work.studentId,
        currentDate ,           
        work.grade,
        work.teacherId,
        userId
      );

      console.log('Work Added:', updatedWork);
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
        <h2 className={`title ${theme}`}> {t("updateWork")} </h2>
        <form onSubmit={updateFormSubmissionHandler}>

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
            {isLoading ? "Adding in..." : `${t("update")}`}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UpdateWorkForm;