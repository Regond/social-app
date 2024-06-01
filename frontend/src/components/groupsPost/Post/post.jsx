import React from 'react';
import { useState, useContext } from "react";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import {Link} from "react-router-dom";
import Comments from '../../comment/comments.jsx';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  moment  from 'moment';
import { AuthContext } from '../../auth.js';
import './post.scss';
import {
  useQuery
} from '@tanstack/react-query'
import {api} from '../../../requests.js';

const Post = ({props}) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();


    const deleteMutation = useMutation({
      mutationFn: (postId) => {
        return api.delete("/groupsPost/"+postId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries("groupsPost");
      },
    });


    const handleDelete = () => {
      deleteMutation.mutate(props.id)
    }

  return (
    <div className='post'>
      <div className="container">
        <div className="userInfo">
          <div className="user">
            <img src={`/files/${props.groupImg}`} alt="" />
            <div className="userDetails">
              <Link 
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="username">{props.groupName}</span>
              </Link>
              <span className="time">{moment(props.dateTime).fromNow()}</span>
            </div>
          </div>
           {currentUser.id === props.admin ? <DeleteRoundedIcon onClick={handleDelete} className='delete'/> : ''}
        </div>
        <div className="postContent">
          <p>{props.description}</p>
          <img src={`/files/${props.img}`} alt="" />
        </div>
        <div className="interactions">
        </div>
      </div>
      </div>

  )
}

export default Post