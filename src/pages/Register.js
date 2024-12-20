import { useState } from 'react';
import '../styles/Form.css';
import { register } from '../utils/api';
import { Link } from 'react-router-dom';

const Register = () => {

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
  enteredPassword.length >= 8 && // Minimalno 8 karaktera
  enteredPassword.length <= 20 && // Maksimalno 20 karaktera
  /[a-zA-Z]/.test(enteredPassword) && // Minimum jedno slovo
  /\d/.test(enteredPassword) && // Minimum 1 broj
  /[!@#$%^&*(),.?":{}|<>]/.test(enteredPassword); // Minimum 1 specijalni karakter
  const passwordInputIsInvalid = !enteredPasswordIsValid && inputTouched.password;

  const enteredRepeatedPasswordIsValid = enteredPassword === enteredRepeatedPassword
  const repeatedPasswordInputIsInvalid = !enteredRepeatedPasswordIsValid && inputTouched.repeatedPassword;

  const enteredEmailIsValid = enteredEmail.includes('@');
  const enteredEmailIsInvalid = !enteredEmailIsValid && inputTouched.email;

  const formIsValid = enteredPasswordIsValid && enteredEmailIsValid;
  
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
  
  const repeatedPasswordInputBlurHandler = () => {
    if (enteredRepeatedPassword.length < 1) {
      setError(""); // Ako nije unešen nijedan karakter ne prikazuje se error poruka
    } else if (!(enteredRepeatedPassword.length === enteredPassword.length)) {
      setError("The repeated password must be the same length as the original password.");
    } else if (!(enteredPassword === enteredRepeatedPassword)) {
      setError("The repeated password does not match the original password.");
    } else {
      setError(""); // Ako je šifra validna ne prikazuje se error poruka
    }
    setInputTouched((prev) => ({ ...prev, repeatedPassword: true }));
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
      const userData = await register(enteredFirstName, enteredLastName, enteredEmail, enteredPassword, enteredRepeatedPassword);
      console.log('Registration successful:', userData);
      
      // Nakon uspješnoh Login-a prazne se input polja
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
    <div className="wrapper Register">
      <div className="form-container">

        <h2 className="title">Register</h2>

        <form onSubmit={formSubmissionHandler}>

          <div className="row">
            <div className="col-1">
              <label htmlFor="name" className="label-text">Name</label>
            </div>
          </div>
          <div className="row">
            <div className={`col form-group ${firstNameInputIsInvalid ? 'invalid' : ''}`}>
              <input 
              type="text" 
              className="form-control" 
              placeholder="First name"
              onChange={firstNameInputChangeHandler}
              onBlur={firstNameInputBlurHandler}
              value={enteredFirstName}
              />
              {renderErrorMessage(firstNameInputIsInvalid, 'Please enter first name.')}
            </div>
            <div className={`col form-group ${lastNameInputIsInvalid ? 'invalid' : ''}`}>
              <input 
              type="text" 
              className="form-control" 
              placeholder="Last name"
              onChange={lastNameInputChangeHandler}
              onBlur={lastNameInputBlurHandler}
              value={enteredLastName}
              />
              {renderErrorMessage(lastNameInputIsInvalid, 'Please enter last name.')}
            </div>
          </div>


          <div className="row">
            <div className="col-1-2">
              <label htmlFor="email" className="label-text">Email adress</label>
            </div>
          </div>

          <div className={`row form-group ${enteredEmailIsInvalid ? 'invalid' : ''}`}>
            <div className="col">
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="name@example.com"
                onChange={emailInputChangeHandler}
                onBlur={emailInputBlurHandler}
                value={enteredEmail}
              />
            </div>
            <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            {renderErrorMessage(enteredEmailIsInvalid, 'Please enter a valid email address.')}
          </div>


          <div className="row">
            <div className="col-1">
              <label htmlFor="password" className="label-text">Password</label>
            </div>
          </div>

          <div className="row form-group">
            <div className={`col ${passwordInputIsInvalid ? 'invalid' : ''}`}>
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
            </div>

            <div className={`col ${repeatedPasswordInputIsInvalid ? 'invalid' : ''}`}>
              <input 
              type="password" 
              className="form-control" 
              id="password2" 
              placeholder="Repeat password"
              onChange={repeatedPasswordInputChangeHandler}
              onBlur={repeatedPasswordInputBlurHandler}
              value={enteredRepeatedPassword}
              maxLength={20}
              />
            </div>
            <small id="passwordHelpBlock" className="form-text text-muted">
              Must be 8-20 characters long, contain letters, numbers and special characters (not contain spaces or emoji).
            </small>
            {renderErrorMessage(passwordInputIsInvalid, `Please enter a valid password. ${error}`)}
            {!passwordInputIsInvalid && repeatedPasswordInputIsInvalid && renderErrorMessage(repeatedPasswordInputIsInvalid, `${error}`)}

          </div>


          <button disabled={!formIsValid || isLoading} type="submit" className="submit-button form-group">  
          {isLoading ? 'Registering in...' : 'Register'}
          </button>

          <div className="text-center">
            <p>Already a member?
            <Link to="/login"> Login </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Register;
  