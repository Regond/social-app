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

  const { isPending, error, data } = useQuery({
    queryKey: ['likes', props.id],
    queryFn: () =>
      api.get("/likes?postId="+props.id).then(res => {
        return res.data
      }
      ),
  })
  const isLiked = data ? data.includes(currentUser.id) : false;


  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return api.delete("/likes?postId="+ props.id)
      return api.post("/likes", {postId: props.id})
    },
    onSuccess: () => {
      queryClient.invalidateQueries("likes");
    },
  });

    const deleteMutation = useMutation({
      mutationFn: (postId) => {
        return api.delete("/posts/"+postId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries("posts");
      },
    });

    const handleLike = () => {
        mutation.mutate(data.includes(currentUser.id))
    }

    const handleDelete = () => {
      deleteMutation.mutate(props.id)
    }
  return (
    <div className='post'>
      <div className="container">
        <div className="userInfo">
          <div className="user">
            <img src={`/files/${props.profile}`} alt="" />
            <div className="userDetails">
              <Link 
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="username">{props.username}</span>
              </Link>
              <span className="time">{moment(props.dateTime).fromNow()}</span>
            </div>
          </div>
           {currentUser.id === props.userId ? <DeleteRoundedIcon onClick={handleDelete} className='delete'/> : ''}
        </div>
        <div className="postContent">
          <p>{props.description}</p>
          <img src={`/files/${props.img}`} alt="" />
        </div>
        <div className="interactions">
          <div className="item">
            {  isPending
            ? <FavoriteBorderOutlinedIcon />
            :!isLiked ? <FavoriteBorderOutlinedIcon onClick={handleLike}/> : <FavoriteOutlinedIcon onClick={handleLike}/>}
            {isPending ? '0' :data.length} Likes
            
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>

        {commentOpen && <Comments postId = {props.id}/>}
      </div>
      </div>

  )
}

export default Post