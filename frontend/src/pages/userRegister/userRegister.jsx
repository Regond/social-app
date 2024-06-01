import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './register.scss';

const UserRegister = () => {
  const [userData, setUserData] = useState({
    username:"",
    email:"",
    password:"",
  });
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const chatEngineData = {
    'username': userData.username,
    'secret': userData.password
  };

  const handleChange = e => {
    setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  var config = {
    method: 'post',
    url: 'https://api.chatengine.io/users/',
    headers: {
      'PRIVATE-KEY': '{{d0bc6167-6999-4196-acf2-c9186247aaad}}'
    },
    data: chatEngineData
  };

  const handleRegister = async e => {
    e.preventDefault();
    if (!userData.username || !userData.email || !userData.password) {
      setErr("All fields are required");
      return;
    }
    try {
      await axios.post("http://localhost:8800/api/auth/register", userData)
      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
        navigate('/login');
        alert('Login now.')
    } catch(e) {
      setErr(e.response.data);
    }
  }

  return (
    <div className='register'>
      <div className="card">
          <div className="leftSide"></div>
          <div className="rightSide">
              <h1>Register</h1>
              <h2>Welcome to Cuteness</h2>
              <form>
                <p>Enter username</p>
                <input type="text" name="username" onChange={handleChange}/>
                <p>Enter e-mail</p>
                <input type="email" name="email" onChange={handleChange}/>
                <p>Enter password</p>
                <input type="password" name="password" onChange={handleChange}/>
                { err==null ? "" : 
                  <span className='error'>{err}</span>
                }
                <button onClick={handleRegister}>Sign up</button>
              </form>
              <Link to='/login'><button>Login</button></Link>
          </div>
      </div>
    </div>
  );
}

export default UserRegister;
