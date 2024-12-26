import { useContext, useState } from 'react';
import '../styles/Form.css';
import { register } from '../utils/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../theme/Theme';
import { useAuth } from '../utils/auth';

const Register = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const { user, register: contextRegister } = useAuth(); 

  const [enteredFirstName, setEnteredFirstName] = useState('');
  const [enteredLastName, setEnteredLastName] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredRepeatedPassword, setEnteredRepeatedPassword] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [inputTouched, setInputTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    repeatedPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const enteredFirstNameIsValid = enteredFirstName.trim() !== '';
  const firstNameInputIsInvalid = !enteredFirstNameIsValid && inputTouched.firstName;

  const enteredLastNameIsValid = enteredLastName.trim() !== '';
  const lastNameInputIsInvalid = !enteredLastNameIsValid && inputTouched.lastName;

  const enteredPasswordIsValid = 
  enteredPassword.length >= 8 && 
  enteredPassword.length <= 20 && 
  /[a-zA-Z]/.test(enteredPassword) && 
  /\d/.test(enteredPassword) && 
  /[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword); 
  const passwordInputIsInvalid = !enteredPasswordIsValid && inputTouched.password;

  const enteredRepeatedPasswordIsValid = enteredPassword === enteredRepeatedPassword
  const repeatedPasswordInputIsInvalid = !enteredRepeatedPasswordIsValid && inputTouched.repeatedPassword;

  const enteredEmailIsValid = enteredEmail.includes('@');
  const enteredEmailIsInvalid = !enteredEmailIsValid && inputTouched.email;

  const formIsValid = enteredEmailIsValid && enteredPasswordIsValid && enteredRepeatedPasswordIsValid;
  
  const firstNameInputChangeHandler = (event) => {
    setEnteredFirstName(event.target.value);
  };

  const lastNameInputChangeHandler = (event) => {
    setEnteredLastName(event.target.value);
  };

  const passwordInputChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };
 
  const repeatedPasswordInputChangeHandler = (event) => {
    setEnteredRepeatedPassword(event.target.value);
  }; 

  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  
  const firstNameInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, firstName: true }));
  };

  const lastNameInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, lastName: true }));
  };

  const passwordInputBlurHandler = () => {
    if (enteredPassword.length < 1) {
      setError(""); 
    } else if (enteredPassword.length < 8 || enteredPassword.length > 20) {
      setError("Password must be 8 to 20 characters.");
    } else if (!/[a-zA-Z]/.test(enteredPassword)) {
      setError("Password must contain at least one letter.");
    } else if (!/\d/.test(enteredPassword)) {
      setError("Password must contain at least one number.");
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword)) {
      setError("Password must contain at least one special character.");
    } else if (/\s/.test(enteredPassword)) {
      setError("Password should not contain spaces.");
    } else {
      setError(""); 
    }
    setInputTouched((prev) => ({ ...prev, password: true }));
  };
  
  const repeatedPasswordInputBlurHandler = () => {
    if (enteredRepeatedPassword.length < 1) {
      setError(""); 
    } else if (!(enteredRepeatedPassword.length === enteredPassword.length)) {
      setError("The repeated password must be the same length as the original password.");
    } else if (!(enteredPassword === enteredRepeatedPassword)) {
      setError("The repeated password does not match the original password.");
    } else {
      setError(""); 
    }
    setInputTouched((prev) => ({ ...prev, repeatedPassword: true }));
  };
  
  const emailInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, email: true }));
  };

  const renderErrorMessage = (isInvalid, errorMessage) => {
    return isInvalid && <p className="error-text" >{errorMessage}</p>;
  };
  
  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!enteredEmailIsValid || !enteredPasswordIsValid || !enteredRepeatedPasswordIsValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { user:userData, token } = await register(enteredFirstName, enteredLastName, enteredEmail, enteredPassword, enteredRepeatedPassword);
      console.log('Registered user:', user);
      console.log('JWT token:', token);
      contextRegister(userData, token);
      
      setEnteredFirstName('');
      setEnteredLastName('');
      setEnteredPassword('');
      setEnteredRepeatedPassword('');
      setEnteredEmail('');
      setInputTouched({ firstName: false, lastName: false, email: false, password: false, repeatedPassword: false });
      
    } catch (error) {
      console.error('Registration failed:', error.message);
      alert(error.message || 'Registration failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper register">
      <div className={`form-container ${theme}`}>

        <h2 className={`title ${theme}`}> {t("register")} </h2>

        <form onSubmit={formSubmissionHandler}>
          <div className={`form-group ${theme}`}>
            <div className="row">
              <div className="col-1">
                <label htmlFor="name" className="label-text"> {t("name")} </label>
              </div>
            </div>
            <div className="row">
              <div className={`col form-group ${firstNameInputIsInvalid ? 'invalid' : ''}`}>
                <input 
                  type="text" 
                  className={`form-control ${theme}`} 
                  placeholder={t("f_name")}
                  onChange={firstNameInputChangeHandler}
                  onBlur={firstNameInputBlurHandler}
                  value={enteredFirstName}
                />
                {renderErrorMessage(firstNameInputIsInvalid, 'Please enter first name.')}
              </div>
              <div className={`col form-group ${lastNameInputIsInvalid ? 'invalid' : ''}`}>
                <input 
                  type="text" 
                  className={`form-control ${theme}`}  
                  placeholder={t("l_name")}
                  onChange={lastNameInputChangeHandler}
                  onBlur={lastNameInputBlurHandler}
                  value={enteredLastName}
                />
                {renderErrorMessage(lastNameInputIsInvalid, 'Please enter last name.')}
              </div>
            </div>


            <div className="row">
              <div className="col-1-2">
                <label htmlFor="email" className="label-text">{t("email")}</label>
              </div>
            </div>

            <div className={`row form-group ${enteredEmailIsInvalid ? 'invalid' : ''}`}>
              <div className="col">
                <input 
                  type="email" 
                  className="form-control" 
                  id="email" 
                  placeholder={t("email_placeholder")}
                  onChange={emailInputChangeHandler}
                  onBlur={emailInputBlurHandler}
                  value={enteredEmail}
                />
              </div>
              <small id="emailHelp" className={`form-text ${theme}`}>{t("email_desc")}</small>
              {renderErrorMessage(enteredEmailIsInvalid, 'Please enter a valid email address.')}
            </div>


            <div className="row">
              <div className="col-1">
                <label htmlFor="password" className="label-text"> {t("pass")} </label>
              </div>
            </div>

            <div className="row form-group">
              <div className={`col ${passwordInputIsInvalid ? 'invalid' : ''}`}>
                <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder={t("pass_placeholder")}
                onChange={passwordInputChangeHandler}
                onBlur={passwordInputBlurHandler}
                value={enteredPassword}
                maxLength={20}
                />
              </div>

              <div className={`col ${repeatedPasswordInputIsInvalid ? 'invalid' : ''}`}>
                <input 
                type="password" 
                className="form-control" 
                id="password2" 
                placeholder={t("pass_placeholder_rp")}
                onChange={repeatedPasswordInputChangeHandler}
                onBlur={repeatedPasswordInputBlurHandler}
                value={enteredRepeatedPassword}
                maxLength={20}
                />
              </div>
              <small id="passwordHelpBlock" className={`form-text ${theme}`}>{t("pass_desc")}</small>
              {renderErrorMessage(passwordInputIsInvalid, `Please enter a valid password. ${error}`)}
              {!passwordInputIsInvalid && repeatedPasswordInputIsInvalid && renderErrorMessage(repeatedPasswordInputIsInvalid, `${error}`)}
            
            </div>


            <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">  
              {isLoading ? 'Registering in...' : t("register")}
            </button>

            <div className="text-center">
              <p>{t("reg_txt3")} 
              <Link to="/login">{t("login")} </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
  