import React from 'react';
import { useContext, useState, useRef } from "react";
import {AuthContext} from '../auth.js';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from '../../requests.js';
import { useQuery } from "@tanstack/react-query";
import AddStory from '../addStory/addStory.jsx';
import './stories.scss';
import  useUser from '../user.js';

const Stories = () => {
    const {currentUser} = useContext(AuthContext)   
    const [addStory, setAddStory] = useState(false);
    const queryClient = useQueryClient();
    const {user} = useUser();

    const { isPending, error, data } = useQuery({
      queryKey: ['stories'],
      queryFn: () =>
        api.get("/stories").then(res => {
          return res.data
        }
        ),
    })
    const uniquePosts = useRef([]);
    if (data) {
      uniquePosts.current = [...new Map(data.map(post => [post.id, post])).values()];
    }
    const deleteMutation = useMutation({
      mutationFn: (storyId) => {
        return api.delete("/stories/"+storyId)
      },
      onSuccess: () => {
        queryClient.invalidateQueries("stories");
      },
    });

    const handleDelete = (storyId) => {
      deleteMutation.mutate(storyId)
    }
  return (
    <div className="stories">
      <div className={uniquePosts.current.length === 0 ? 'solo' : 'story'}>
          <img src={`/files/${user?.profile}`} className='profilePic' alt="" />
          <div className="black"></div>
          <span>{currentUser.username}</span>
          <span className='title'>Add your story</span>
          <button onClick={() => setAddStory(true)}>+</button>
        </div>
      {isPending
      ? "loading"
      :uniquePosts.current.map(story=>(
        <div className="story" key={story.id}>
          <img src={`/files/${story.img}`} alt="" />
          <span>{story.username}</span>
          {currentUser.id == story.userId ? <DeleteRoundedIcon className='trash' onClick={() => handleDelete(story.id)}/> : ''}
        </div>
      ))}

      {addStory && <AddStory setAddStory={setAddStory}/>}
    </div>
  )
}

export default Stories