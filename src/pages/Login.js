import { useContext, useState, useEffect } from 'react';
import '../styles/Form.css';
import { login } from '../utils/api';
import { Link, useNavigate} from 'react-router-dom';
import { ThemeContext } from '../theme/Theme';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../utils/auth';

const Login = () => {

  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, login: contextLogin } = useAuth(); 

  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [inputTouched, setInputTouched] = useState({
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate('/');  
    }
  }, [user, navigate]);

  const enteredPasswordIsValid = 
  enteredPassword.length >= 8 && 
  enteredPassword.length <= 20 && 
  /[a-zA-Z]/.test(enteredPassword) && 
  /\d/.test(enteredPassword) && 
  /[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword); 
  const passwordInputIsInvalid = !enteredPasswordIsValid && inputTouched.password;

  const enteredEmailIsValid = enteredEmail.includes('@');
  const enteredEmailIsInvalid = !enteredEmailIsValid && inputTouched.email;

  const formIsValid = enteredPasswordIsValid && enteredEmailIsValid;

  const passwordInputChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
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

  const emailInputBlurHandler = () => {
    setInputTouched((prev) => ({ ...prev, email: true }));
  };

  const renderErrorMessage = (isInvalid, errorMessage) => {
    return isInvalid && <p className="error-text">{errorMessage}</p>;
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!enteredPasswordIsValid || !enteredEmailIsValid) {
      setIsLoading(false);
      return;
    }

    try {
      const { user:loggedInUser, token:jwtToken } = await login(enteredEmail, enteredPassword);
      contextLogin(loggedInUser, jwtToken);

      console.log('Logged in user:', loggedInUser);
      console.log('JWT Token:', jwtToken);

      setEnteredPassword('');
      setEnteredEmail('');
      setInputTouched({ email: false, password: false });
    } catch (error) {
        console.error('Login failed:', error.message);
        alert(error.message || 'Login failed. Please check your credentials.');
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="wrapper">
      <div className={`form-container ${theme}`}>
        <h2 className={`title ${theme}`}> {t("login")} </h2>
        <form onSubmit={formSubmissionHandler}>
          <div className={`form-group ${theme} ${enteredEmailIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="email" className="label-text"> {t("email")} </label>
            <input 
              type="email" 
              className={`form-control ${theme}`} 
              id="email" 
              placeholder={t("email_placeholder")}
              onChange={emailInputChangeHandler}
              onBlur={emailInputBlurHandler}
              value={enteredEmail}
            />
            <small id="emailHelp" className="form-text text-muted"> {t("email_desc")} </small>
            {renderErrorMessage(enteredEmailIsInvalid, 'Please enter a valid email address.')}
          </div>
          
          <div className={`form-group ${theme} ${passwordInputIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="password" className="label-text"> {t("pass")} </label>
            <input 
              type="password" 
              className={`form-control ${theme}`}
              id="password" 
              placeholder={t("pass_placeholder")}
              onChange={passwordInputChangeHandler}
              onBlur={passwordInputBlurHandler}
              value={enteredPassword}
              maxLength={20}
            />
            <small id="passwordHelpBlock" className={`form-text text-muted ${theme === "light" ? "dark" : "light"}`}>
              {t("pass_desc")}
            </small>
            {renderErrorMessage(passwordInputIsInvalid, `Please enter a valid password. ${error}`)}
            
          </div>
          
          <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">
            {isLoading ? 'Logging in...' : 'Login'}
            
          </button>

                 
          <div className={`text-center icons ${theme}`}>
            <p>{t("reg_txt1")}
              <Link to="/register">{t("register")} </Link><br/>
              {t("reg_txt2")}
            </p>
            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1 small-btn">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1 small-btn">
              <i className="fab fa-google"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1 small-btn">
              <i className="fab fa-twitter"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1 small-btn">
              <i className="fab fa-github"></i>
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default Login;