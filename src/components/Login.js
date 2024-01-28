// Login.js

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import './Login.css'

const Login = () => {
  const [email, setEmail] = useState('');
  const [error,setError] = useState('');
  const [password, setPassword] = useState('');
  const navigate= useNavigate();

  useEffect(() => {
    document.title = 'eJob Login';
  }, []);

  const handleLogin = async() => {
    setError('');
    if (email && password) {
        try {
            const response = await axios.post(`/api/users/login?email=${email}&password=${password}`);
      
            if (response.status === 200 && response.data !=="") {
              // Handle successful login
              localStorage.setItem("name",response.data.name);
              localStorage.setItem("email",response.data.email);
              
              console.log('Login successful',response.data);
              navigate("/dashboard")

            } else {
              // Handle login failure
              setError("Wrong email or password")
              console.error('Login failed');
            }
          } catch (error) {
            // Handle network or server errors
            console.error('Error during login:', error);
          }
    } else {
      alert('Please enter both name and password');
    }
  };

  return (
    <div className="login_header">
      <h2>Welcome to eJob<WorkIcon/></h2>
      <h2 >Login</h2>
      <label>Email:</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />

      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <br/>
      <label>Not a member yet?</label>
      <Link to="/">Sign Up</Link>
    </div>
  );
};

export default Login;
