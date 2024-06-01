import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {api} from '../../requests.js';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import scrollToPost from '../posts/posts.jsx'
import './notifications.scss';

const Notifications = ({setNotificationsOpen, userId, data}) => {
    const navigate = useNavigate();

    const handleClose = () => {
        setNotificationsOpen(false);
    }

    const handleNotificationClick = (postId) => {
        navigate(`/#${postId}`);
        setNotificationsOpen(false);
      }

    useEffect(() => {
      const handleSeenNotifications = async () => {
          try {
              if (data.length > 0) {
                  await api.patch('notifications/seen');
              }
          } catch (error) {
              console.error(error);
          }
      };

      handleSeenNotifications(); 
  }, []);
  return (
    <div className='notifications'>
        <button onClick={handleClose}>x</button>
        {data.length === 0 ? 
        <div className="zero">
            <NotificationsActiveOutlinedIcon className='icon'/>
            <span>You dont have notifications</span>
        </div>
        :<div className="notfs">
            {data.map((item)=>
                <div className="item" key = {item.id} onClick={() => handleNotificationClick(item.postId)}>
                    <img src={`/files/${item.pic}`} alt="" />
                    <div className="act">
                        <span>{item.username}</span>
                        <span className='desc'>{item.description ? `comment your photo : ${item.description}` : 'liked your photo'}</span>
                    </div>

                </div>
            )
            }

        </div>
            }
    </div>
  )
}

export default Notifications