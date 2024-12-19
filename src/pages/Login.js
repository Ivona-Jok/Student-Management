import { useState } from 'react';
import '../styles/Login.css';
import { login } from '../utils/api';

const Login = (props) => {
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredPasswordTouched, setEnteredPasswordTouched] = useState(false);

  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredEmailTouched, setEnteredEmailTouched] = useState(false);

  const enteredPasswordIsValid = enteredPassword.trim() !== '';
  const passwordInputIsInvalid = !enteredPasswordIsValid && enteredPasswordTouched;

  const enteredEmailIsValid = enteredEmail.includes('@');
  const enteredEmailIsInvalid = !enteredEmailIsValid && enteredEmailTouched;

  let formIsValid = false;

  if (enteredPasswordIsValid && enteredEmailIsValid) {
    formIsValid = true;
  }

  const passwordInputChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const emailInputChangeHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordInputBlurHandler = (event) => {
    setEnteredPasswordTouched(true);
  };

  const emailInputBlurHandler = (event) => {
    setEnteredEmailTouched(true);
  };

  const formSubmissionHandler = async (event) => {
    event.preventDefault();

    setEnteredPasswordTouched(true);
    setEnteredEmailTouched(true);
  
    if (!enteredPasswordIsValid || !enteredEmailIsValid) {
      return;
    }
    
    try {
      const userData = await login(enteredEmail, enteredPassword);
      console.log('Login successful:', userData);
      
      // Kod za preusmjeravanje na neku stranicu ili za čuvanje login podataka

      // Nakon uspješnog logovanja praznimo input polja
      setEnteredPassword('');
      setEnteredPasswordTouched(false);

      setEnteredEmail('');
      setEnteredEmailTouched(false);
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  const passwordInputClasses = passwordInputIsInvalid
  ? 'form-control invalid'
  : 'form-control';

  const emailInputClasses = enteredEmailIsInvalid
    ? 'form-control invalid'
    : 'form-control';

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        <br></br>
          <form onSubmit={formSubmissionHandler}>
            <div class="form-group" className={emailInputClasses}>
              <label for="exampleInputEmail1" className='label-text'>Email address</label>
              <input 
              type="email" 
              class="form-control" 
              id="email" 
              aria-describedby="emailHelp" 
              placeholder="name@example.com"
              onChange={emailInputChangeHandler}
              onBlur={emailInputBlurHandler}
              value={enteredEmail}
              />
              <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
              {enteredEmailIsInvalid && (
                <p className='error-text'>Please enter a valid email address.</p>
              )}
            </div>
            <br></br>
            <div class="form-group" className={passwordInputClasses}>
              <label for="exampleInputPassword1" className='label-text'>Password</label>
              <input 
              type="password" 
              class="form-control" 
              id="password" 
              aria-describedby="passwordHelp" 
              placeholder="Enter password"
              onChange={passwordInputChangeHandler}
              onBlur={passwordInputBlurHandler}
              value={enteredPassword}
              />
              <small id="passwordHelp" class="form-text text-muted">Your password is safe with us.</small>
              
              {passwordInputIsInvalid && (
                <p className='error-text'>Please enter a valid password.</p>
              )}
            </div>
            <br></br><br></br>
            
            <button disabled={!formIsValid} type="submit" className="login-button">Login</button>
          </form>
        </div>
    </div>
  );
};

export default Login;