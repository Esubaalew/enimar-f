import React, { useState } from 'react';
import { signIn } from '../API/auth';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Signin.css';

const SignIn = () => {
  const [userData, setUserData] = useState({
    username: '',
    password: ''
  });
  console.log(userData);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!userData.username || !userData.password) {
      setError('Please enter both username and password.');
      return;
    }
  
    try {
      setLoading(true); 
      const response = await signIn(userData);
      console.log('Signed in successfully:', response);
      localStorage.setItem('user', JSON.stringify(response));
      navigate(`/home`);
    } catch (error) {
      console.error('Error signing in:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="signin-container">
      <div className="left-side">
        <h1>Enimar Code Learning</h1>
        <p>Connect with friends and the world around you on Enimar Code Learning.</p>
      </div>
      <div className="right-side">
        <div className="signin-form">
          <input type="text" name="username" placeholder="Username" onChange={handleChange} className="input-field" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input-field" />
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleSignIn} className="signin-button" disabled={loading}>
            {loading ? <i className="fa fa-spinner fa-spin"></i> : 'Sign In'}
          </button>
          <p className="forgot-password-link"><Link to="/reset">Forgot Password?</Link></p>
          <p className="register-link">Not Registered Yet? <Link to="/StudentSignUp">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
