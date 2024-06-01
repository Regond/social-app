import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../requests.js';
import './userGroup.scss';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import Posts from '../../components/groupsPost/groupPosts.jsx';
import { AuthContext } from '../../components/auth.js';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AddPost from '../../components/addPost/addGroupPost.jsx';

const UserGroup = () => {

  const groupId = useLocation().pathname.split("/")[2];
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);


  const { isPending, data: groupData } = useQuery({
    queryKey: ['group'],
    queryFn: () => api.get("/groups/find/" + groupId).then(res => res.data)
  });

  const { isLoading, data: membersInfo } = useQuery({
    queryKey: ['members'],
    queryFn: () => api.get("/members?groupId=" + groupId).then(res => res.data)
  });



  const mutation = useMutation({
    mutationFn: (join) => {
      if (join) return api.delete("/members?groupId=" + groupId);
      return api.post("/members", { id: groupId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("members");
    },
  });


  const handleFollowing = () => {
    if (isLoading) {
      console.log('loading');
    } else {
      mutation.mutate(membersInfo.includes(currentUser.id));
    }
  };

  return (
    <React.StrictMode>
      {isPending ? console.log("loading") :
        <div className='mainContainer'>
          <div className="group">
            <img className='coverImage' src={`/files/${groupData[0].cover}`} alt="" />
            <img className='groupImage' src={`/files/${groupData[0].img}`} alt="" />
            <div className="info">
              <div className="cover">
                <h1>{groupData[0].name}</h1>
                <h3>{groupData[0].description}</h3>
                <span> <GroupRoundedIcon/> {membersInfo? membersInfo.length : 0} members</span>
              </div>
              {groupData[0].adminId === currentUser.id ? ''
              :<button onClick={handleFollowing}>
                  {isLoading ? 'Loading' : membersInfo.includes(currentUser.id) ? "Following" : "Follow"}
                </button>
              } 

            </div>

          </div>
           {currentUser.id == groupData[0].adminId ? <AddPost group = {groupData}/> : '' }
          <Posts groupId={groupId}/>
        </div>
      }
    </React.StrictMode>
  );
};

export default UserGroup;
