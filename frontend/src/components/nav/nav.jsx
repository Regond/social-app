import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {api} from '../../requests.js';
import { Link, useLocation } from "react-router-dom";
import FoundationOutlinedIcon from '@mui/icons-material/FoundationOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import Notifications from '../notifications/notifications.jsx';
import './nav.scss';
import { AuthContext } from '../auth.js';
import  useUser  from '../user.js';
const Navbar = () => {

  const {currentUser} = useContext(AuthContext);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const [data, setData] = useState([]);
  const { isLoading, error, user } = useUser();
  useEffect(() => {
      const fetchUnseenLikes = async () => {
          try {
              const response = await api.get(`/notifications/unseenData`);
              setData(response.data);
          } catch (error) {
              console.error(error);
          }
      };

      fetchUnseenLikes();
  }, [currentUser.id]);
  return (
    <div className='nav'>
      <div className="leftCard">
        <div className="logo">    
          <img src="https://cdn.kibrispdr.org/data/51/cute-dragon-png-1.png" alt="" />    
          <span>CUTENESS.</span>
        </div>
      </div>
      <div className="center">
        <div className="searchBar">
            <SearchSharpIcon className='searchIcon'/>
            <input type="text" placeholder='Start typing or search...'/>
        </div>

        <div className="cover">
          <Link to='/' style={{'display':'flex','alignItems':'center','textDecoration': 'none', 'color':'#0055FF'}}>
              <div className={location.pathname === '/' ? 'active' : 'circle'}>
                <FoundationOutlinedIcon className={location.pathname === '/' ? 'activeIcon' : 'icon'}/>
              </div>
            </Link>
            <Link to='/chats' style={{'display':'flex','alignItems':'center','textDecoration': 'none', 'color':'#0055FF'}}>
              <div className="circle">
                <MailOutlinedIcon className='icon'/>
              </div>
          </Link>
          <Link to='/groups' style={{'display':'flex','alignItems':'center','textDecoration': 'none', 'color':'#0055FF'}}>
              <div className={location.pathname === '/groups' ? 'active' : 'circle'}>
                <GroupsOutlinedIcon className={location.pathname === '/groups' ? 'activeIcon' : 'icon'}/>
              </div>
          </Link>
        </div>
      </div>
      <div className="rightCard">
        <NotificationsActiveOutlinedIcon className = {data.length === 0 ? 'notification' : 'anim'} onClick={() => setNotificationsOpen(!notificationsOpen)}/>
        {data.length === 0 ? '' 
        : <div className="notificationsCount"><span className='count'>{data.length}</span></div>
        }
        {notificationsOpen && <Notifications data = {data} setNotificationsOpen = {setNotificationsOpen} userId = {currentUser.id}/>}
       {isLoading ? '' 
       :
        <div className="user">
          <Link style={{'textDecoration': 'none', 'color':'#0055FF', 'fontWeight': '600'}} state={{update: false}} to={`/profile/${currentUser.id}`}>
            <img className='image' src={`/files/${user?.profile}`} alt="" />
          </Link>  
        </div>
       }

      </div>

    </div>
  )
}

export default Navbar;