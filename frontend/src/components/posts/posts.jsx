import React, {useRef, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {
  useQuery
} from '@tanstack/react-query'
import './posts.scss';
import Post from './Post/post.jsx';
import {api} from '../../requests.js';

const Posts = ({userId}) => {
  const location = useLocation();
  const uniquePosts = useRef([]);
  const { isPending, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      api.get("/posts?userId="+ userId).then(res => {
        return res.data
      }
      ),
  })

 if (data) {
   uniquePosts.current = [...new Map(data.map(post => [post.id, post])).values()];
 }

 useEffect(() => {
  if (location.hash) {
    const postId = location.hash.substring(1);
    const element = document.getElementById(postId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}, [location.hash, data]);
  
  return (
    <div className='posts'>
      {isPending ? "loading" :
      uniquePosts.current.map(post=>(
          <div id={post.id} key={post.id}>
              <Post props={post} key={post.id} />
          </div>
        ))
      }
    </div>
  )
}

export default Posts