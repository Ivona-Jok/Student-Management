import { useState } from 'react';
import '../styles/Login.css';
import { login } from '../utils/api';

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
      setError(""); // Clear the error message if password is valid
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
      
      // Clear fields after successful login
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
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
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
            <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
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
            <small id="passwordHelpBlock" class="form-text text-muted">
              Must be 8-20 characters long, contain letters, numbers and special characters (not contain spaces or emoji).
            </small>
            {renderErrorMessage(passwordInputIsInvalid, `Please enter a valid password. ${error}`)}
            
          </div>
          
          <button disabled={!formIsValid || isLoading} type="submit" className="login-button">
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;