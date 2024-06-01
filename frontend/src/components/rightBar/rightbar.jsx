import React, {useState, useEffect} from 'react';
import './rightbar.scss';
import {Link} from "react-router-dom";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {api} from '../../requests.js';
import axios from "axios";


const Rightbar = ({user}) => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);

  const { isPending, error, data } = useQuery({
    queryKey: ['request'],
    queryFn: () =>
      api.get("/requests").then(res => {
        setRequests(res.data); 
        return res.data
      }
      ),
  })  

  const { isLoading, data : dataUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      api.get("/users").then(rs => {
        setUsers(rs.data)
        return rs.data
      }
      ),
  })  
  return (
    <div className='rightbar'>
      <div className="container">
        <div className="item">
          <h4>Friend Requests</h4>
          <div className="requests">
          { isPending ? 'loading'
          : requests.map((user, index) => (
              <Link key={user.id} to={`/profile/${user.id}`} state={{update: false}} style={{ textDecoration: 'none', color: 'grey' }}>
                <div className="theme">
                  <div className="info">
                    <img src={`/files/${user.profile}`} alt="" />
                    <span>{user.username}</span>
                  </div>
                  <button>✔</button>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="item">
          <span span>Recomendations</span>
          <div className="requests">
  {isLoading ? 'loading' : (
    typeof users === 'object' && Object.keys(users).length > 0 ? (
      Object.keys(users).map(key => {
        const people = users[key];
        // Проверяем, что имена пользователей не совпадают
        if (people.username !== user.username) {
          return (
            <Link key={people.id} to={`/profile/${people.id}`} state={{update: false}} style={{ textDecoration: 'none', color: 'grey' }}>
              <div className="theme">
                <div className="info">
                  <img src={`/files/${people.profile}`} alt="" />
                  <span>{people.username}</span>
                </div>
              </div>
            </Link>
          );
        } else {
          // Если имена совпадают, возвращаем пустой фрагмент
          return null;
        }
      })
    ) : (
      <p>No users available</p>
    )
  )}
</div>

</div>

      </div>

    </div>
  )
}

export default Rightbar