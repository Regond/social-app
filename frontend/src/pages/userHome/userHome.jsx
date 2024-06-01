import React from 'react';
import './styles.scss';
import Stories from '../../components/storiesBar/stories.jsx';
import Posts from '../../components/posts/posts.jsx';
import Shares from '../../components/addPost/addPost.jsx';

const userHome = () => {
  return (
    <div className = "home">
      <Stories/>
      <Shares/>
      <Posts/>
    </div>
  )
}

export default userHome