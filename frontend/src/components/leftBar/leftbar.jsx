import React, { useState, useEffect, useContext } from 'react';
import './leftbar.scss';
import axios from "axios";
import { Link } from "react-router-dom";
import SettingsSuggestOutlinedIcon from '@mui/icons-material/SettingsSuggestOutlined';
import AutoGraphOutlinedIcon from '@mui/icons-material/AutoGraphOutlined';
import Person4OutlinedIcon from '@mui/icons-material/Person4Outlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Cookies from 'js-cookie';
import { AuthContext } from '../auth';

const Leftbar = ({ user }) => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.chatengine.io/chats/', {
          headers: {
            'Project-ID': '{{fc42bc2c-837a-401b-b5b4-5cfbd0b9254b}}',
            'User-Name': user.username,
            'User-Secret': user.password
          }
        });
        setChats(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [user]);

  const handleClearUser = () => {
    localStorage.removeItem('user');
    window.location.reload();
    console.log('Элемент с ключом "user" был удален из Local Storage');
};


  const gradients = [
    'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 56%, rgba(252,176,69,1) 100%)',
    'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,224,29,1) 56%, rgba(252,176,69,1) 100%)',
    'linear-gradient(90deg, rgba(107,232,151,1) 0%, rgba(253,224,29,1) 56%, rgba(252,176,69,1) 100%)',
    'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%)',
    'radial-gradient(circle, rgba(197,209,222,1) 0%, rgba(208,254,10,1) 100%)'
  ];

  return (
    <div className='leftbar'>
      <div className="container">
        <div className="chatsContainer">
          <h4>Chats</h4>
          <div className="chats">
            {chats.map((chat, index) => (
              <Link key={chat.id} to='/chats' style={{ textDecoration: 'none', color: 'grey' }}>
                <div className="item">
                  <div className="info">
                    <div className="circle" style={{ background: gradients[index % gradients.length] }}></div>
                    <span>{chat.title}</span>
                  </div>
                  {chat.last_message && chat.last_message.sender && chat.last_message.sender.is_online
                    ? <div className='online'></div>
                    : <div className='offline'></div>
                  }
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="accountContainer">
          <h4>Account</h4>
          <div className="accountInfo">
            <Link to={`/profile/${currentUser.id}`} state={{update: true}} style={{ textDecoration: 'none', color: 'rgb(167, 166, 166)' }}>
              <div className="item">
                <SettingsSuggestOutlinedIcon className='icon'/>
                <span>Settings</span>
              </div>
            </Link>

              <div className="item">
                <AutoGraphOutlinedIcon className='icon'/>
                <span>Analytics</span>
              </div>
              <div className="item">
                <Person4OutlinedIcon className='icon'/>
                <span>Profile</span>
              </div>
              <div className="item">
                <LogoutOutlinedIcon className='icon' onClick={handleClearUser}/>
                <span onClick={handleClearUser}>Logout</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leftbar;
