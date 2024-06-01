    import React from 'react';
    import {
    useQuery
    } from '@tanstack/react-query'
    import './groupPosts.scss';
    import Post from './Post/post.jsx'
    import {api} from '../../requests.js';

    const Posts = ({groupId}) => {
    const { isPending, error, data } = useQuery({
        queryKey: ['groupPosts'],
        queryFn: () =>
        api.get("/groupsPost?groupId="+ groupId).then(res => {
            return res.data
        }
        ),
    })
    console.log(data)

    return (
        <div className='groupPosts'>
        {isPending ? "loading" :
        data.map(post=>(
                <Post props={post} key={post.id}/>
            ))
        }
        </div>
    )
    }

    export default Posts