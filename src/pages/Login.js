import { useState } from 'react';
import '../styles/Form.css';
import { login } from '../utils/api';
import { Link } from 'react-router-dom';

const Login = () => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [inputTouched, setInputTouched] = useState({
    email: false,
    password: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const enteredPasswordIsValid = 
  enteredPassword.length >= 8 && // Minimalno 8 karaktera
  enteredPassword.length <= 20 && // Maksimalno 20 karaktera
  /[a-zA-Z]/.test(enteredPassword) && // Minimum jedno slovo
  /\d/.test(enteredPassword) && // Minimum 1 broj
  /[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword); // Minimum 1 specijalni karakter
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
      setError(""); // Ako nije unešen nijedan karakter ne prikazuje se error poruka
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
      setError(""); // Ako je šifra validna ne prikazuje se error poruka
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
      const userData = await login(enteredEmail, enteredPassword);
      console.log('Login successful:', userData);
      
      // Nakon uspješnoh Login-a prazne se input polja
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
      <div className="form-container">
        <h2 className="title">Login</h2>
        <form onSubmit={formSubmissionHandler}>
          <div className={`form-group ${enteredEmailIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="email" className="label-text">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              placeholder="name@example.com"
              onChange={emailInputChangeHandler}
              onBlur={emailInputBlurHandler}
              value={enteredEmail}
            />
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            {renderErrorMessage(enteredEmailIsInvalid, 'Please enter a valid email address.')}
          </div>
          
          <div className={`form-group ${passwordInputIsInvalid ? 'invalid' : ''}`}>
            <label htmlFor="password" className="label-text">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Enter password"
              onChange={passwordInputChangeHandler}
              onBlur={passwordInputBlurHandler}
              value={enteredPassword}
              maxLength={20}
            />
            <small id="passwordHelpBlock" className="form-text text-muted">
              Must be 8-20 characters long, contain letters, numbers and special characters (not contain spaces or emoji).
            </small>
            {renderErrorMessage(passwordInputIsInvalid, `Please enter a valid password. ${error}`)}
            
          </div>
          
          <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

                 
          <div className="text-center">
            <p>Not a member?
            <Link to="/register"> Register </Link>
            </p>
            <p>or sign up with:</p>
            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-google"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-twitter"></i>
            </button>

            <button  type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-link btn-floating mx-1">
              <i className="fab fa-github"></i>
            </button>
          </div>


        </form>
      </div>
    </div>
  );
};

export default Login;