import {React, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { useContext } from "react";
import './login.scss';
import {AuthContext} from  '../../components/auth.js';

const UserLogin = () => {
  const [userData, setUserData] = useState({
    username:"",
    password:"",
  })
  const [err, setErr] = useState(null);
  const nav = useNavigate();
  
  const handleChange = e => {
    setUserData((prev)=>({ ...prev, [e.target.name]: e.target.value }))
  }

  const { login } = useContext(AuthContext);

  const handleLogin = async(e) => {
    e.preventDefault()
     try {
      await(login(userData))
      nav("/")
     } catch (e) {
        setErr(e.response.data)
     }
  };

  return (
    <div className='login'>
      <div className="card">
          <div className="leftSide"></div>
          <div className="rightSide">
              <h1>Login</h1>
              <h2>Welcome to ...!</h2>
              <form>
                <p>Enter username</p>
                <input type="text" name='username' onChange={handleChange}/>
                <p>Enter password</p>
                <input type="password" name='password' onChange={handleChange}/>
                { err==null ? "" : 
                  <span className='error'>{err}</span>
                }
                <button onClick={handleLogin}>Sign in</button>
              </form>
              <Link to='/register'><button>Register</button></Link>

          </div>
      </div>
    </div>
  )
}

export default UserLogin