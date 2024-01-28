import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import './SignUp.css'
const Signup = () => {
   
  const [name, setName] = useState('');
  const [error,setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate=useNavigate();
  

  useEffect(() => {
    document.title = 'eJob Sign Up';
  }, []);

  const handleSignup = async() => {
    setError('');
    if (name && email && password) {
        try {
            const response = await axios.post('/api/users/signup', {
              name: name,
              email: email,
              password:password
            });
      
            
            if (response.status === 200 || response.status === 201) {
              // Handle successful signup
              console.log('Signup successful');
              alert('Signup successful')
              navigate("/login")

            } else {
              // Handle signup failure
              setError('Signup failed');
            }
          } catch (error) {
            // Handle network or server errors
            console.error('Error during signup:', error);
            if (error.response && error.response.status === 409) {
              // HTTP status 409 corresponds to Conflict (DuplicateKeyException)
              setError('Email already exists. Please use another email.');
            } else {
              // Handle other errors
              setError('An error occurred during signup. Please try again.');
            }

          }
    } else {
      setError('Please fill in all fields');
    }
  };

  return (
    <div className="signup_header">
      <h2>Welcome to eJob<WorkIcon/></h2> 
      <h2>Signup</h2>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleSignup}>Get Started!</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <br/>
      <label>Already have an account?</label>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Signup;
