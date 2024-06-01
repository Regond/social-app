import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import './styles.scss';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Posts from '../../components/posts/posts.jsx';
import  moment  from 'moment';
import AddPost from '../../components/addPost/addProfilePost.jsx'
import  { Update }  from '../../components/updateUser/update.jsx';
import { AuthContext } from '../../components/auth.js';
import {
  useQuery
} from '@tanstack/react-query'
import {api} from '../../requests.js';
import { useLocation } from 'react-router-dom';

const UserProfile = () => {

  let { state } = useLocation();
  const [update, setUpdate] = useState(state ? state.update : false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const userId = useLocation().pathname.split("/")[2];
  const { isPending, error, data } = useQuery({
    queryKey: ['user'],
    queryFn: () =>
      api.get("/users/find/"+userId).then(res => {
        return res.data
      }
      ),
  })
  const { isLoading, e, data: relsInfo } = useQuery({
    queryKey: ['rels'],
    queryFn: () =>
      api.get("/following?followedId=" + userId).then(res => {
        return res.data
      }
      ),
  })


  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return api.delete("/following?userId="+ userId)
      return api.post("/following", {userId})
    },
    onSuccess: () => {
      queryClient.invalidateQueries("rels");
    },
  });

  const handleFollowing = () => {
    mutation.mutate(relsInfo.includes(currentUser.id))
  }

  useEffect(() => {
    if (update) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [update]);
  return (
    <div className='profile'>
      <div className="userTheme">
        <img className='theme' src={
          isPending 
          ? "https://hougumlaw.com/wp-content/uploads/2016/05/light-website-backgrounds-light-color-background-images-light-color-background-images-for-website-1024x640.jpg"
          : `/files/${data.cover}`         }
          alt="" 
          />

        <img className='userPic' src={
          isPending 
          ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          : `/files/${data.profile}`
          } alt="" />
      </div>
      <div className="profileInfo">
        <div className="info">
          <span className="username">{data ? data.username : ''}</span>
          <span className="email">{data ? data.email : ''}</span>
        </div>

          {(userId == currentUser.id) 
          ? (<button onClick={() => setUpdate(true)}>Update</button>)
          : <button onClick={handleFollowing}>{ isLoading ? "Loading"
          : relsInfo.includes(currentUser.id) ? "Following" : "Follow"}</button>}
          <div className="mailCover">
            <MailOutlinedIcon  className='mail'/>
          </div>
          <div className="mailCover">
            <MoreHorizRoundedIcon  className='mail'/>
          </div>
      </div>
      <div className="coverContainer">
        <div className="setInfo">
          <div className="coverInfo">
            <div className="item">
              <LocationCityRoundedIcon className='icon'/>
              <span>{currentUser.city}</span>
            </div>
            <div className="item">
              <LockOpenRoundedIcon className='icon'/>
              <span>Public Account</span>
            </div>
            <div className="item">
              <BadgeRoundedIcon className='icon'/>
              <span>{currentUser.name}</span>
            </div>
            <div className="item">
              <VisibilityOffRoundedIcon className='icon'/>
              <span>Visible</span>
            </div>
          </div>
          <div className="about">
            <span>About</span>
            <div className="text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel maiores at enim incidunt earum, delectus atque. Illo placeat exercitationem, voluptatem iusto ducimus possimus, quaerat molestiae nisi provident, minus quia impedit.</div>
          </div>
        </div>
          <AddPost />
      </div>
      <Posts userId = {userId}/>
      {update && <Update setUpdate={setUpdate} user = {data}/>}
    </div>
  )
}

export default UserProfile