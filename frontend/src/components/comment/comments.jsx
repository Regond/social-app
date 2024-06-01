import React, { useContext, useState } from 'react';
import { AuthContext } from '../auth.js';
import './comments.scss';
import { api } from '../../requests.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '../user.js';
import moment from 'moment';
import ReplyIcon from '@mui/icons-material/Reply';

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const [description, setDesc] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyToComment, setReplyToComment] = useState(null);
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { isPending, error, data } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () =>
      api.get(`/comments?postId=${postId}`).then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return api.post('/comments', newComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    const newComment = {
      description,
      postId,
      replyTo,
    };
    mutation.mutate(newComment);
    setDesc('');
    setReplyTo(null);
    setReplyToComment(null);
  };

  const handleReplyClick = (comment) => {
    setReplyTo(comment.id);
    setReplyToComment(comment);
  };

  return (
    <div className='comments'>
      <div className="writeComment">
        {replyToComment && (
          <div className="replyTo">
            <div className="cover">
              <span>Reply to {replyToComment.username}:</span>
              <p>&nbsp;{replyToComment.description}</p>
            </div>
            <ReplyIcon />
          </div>
        )}
        <div className="cover">
          <img src={`/files/${user?.profile}`} alt="" />
          <input
            type="text"
            placeholder={replyTo ? 'Write a reply' : 'Write a comment'}
            value={description}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button onClick={handleClick}>Send</button>
        </div>
      </div>

      {isPending ? 'Loading...' :
        data.map((comment) => (
          <div key={comment.id} className="comment">
            <img src={`/files/${comment.profile}`} alt="" />
            <div className="info">
              <span>{comment.username}:</span>
              <p>&nbsp;{comment.description}</p>
            </div>
            <span className="time">{moment(comment.dateTime).fromNow()}</span>
            <ReplyIcon className='replyIcon' onClick={() => handleReplyClick(comment)} />
        
            {data.find(reply => reply.id === comment.replyTo) && (
              <div className="reply">
                <div className="info">
                  <span>{comment.username} replied to {data.find(reply => reply.id === comment.replyTo).username}</span>
                </div>
              </div>
            )}
          </div>
        ))
      }
    </div>
  );
};

export default Comments;
