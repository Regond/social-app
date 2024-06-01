import React , { useContext, useState } from 'react';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

import DriveFileRenameOutlineRoundedIcon from '@mui/icons-material/DriveFileRenameOutlineRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

import { AuthContext } from'../auth.js';
import { api } from '../../requests.js';
import DragAndDropFileInput from '../updateUser/dragNDrop/drag.jsx';

import './addGroup.scss';
import { compose } from '@mui/system';

const AddGroup = ({ setAddOpen }) => {
    const { currentUser } = useContext(AuthContext);
    const id = currentUser.id + 999;
    const [file, setFile] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const queryClient = useQueryClient();
    const [values, setValues] = useState({
        id: id,
        name: "",
        description: "",
        adminId: currentUser.id
      });

      const { isLoading, data: membersInfo } = useQuery({
        queryKey: ['members'],
        queryFn: () => api.get("/members?groupId=" + id).then(res => res.data)
      });
    
    
      const mutationFollow = useMutation({
        mutationFn: (join) => {
          if (join) return api.delete("/members?groupId=" + id);
          return api.post("/members", { id });
        },
        onSuccess: () => {
          queryClient.invalidateQueries("members");
        },
      });
    
    
      const handleFollowing = () => {
        if (isLoading) {
          console.log('loading');
        } else {
            mutationFollow.mutate(membersInfo.includes(currentUser.id));
        }
      };

    const load = async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file )
        const rs = await api.post("/load", formData);
        return rs.data;
      }
      catch (e) {
        console.log(e);
      }
    }

    const mutation = useMutation({
        mutationFn: (newGroup) => {
          return api.post("/groups", newGroup)
        },
        onSuccess: () => {
          queryClient.invalidateQueries("groups");
        },
      });
    const handleClick = async (e) => {
        e.preventDefault();
        let coverUrl;
        let profileUrl;
        coverUrl = coverPic ? await load(coverPic) : '';
        profileUrl = profilePic ? await load(profilePic) : '';
        mutation.mutate({ ...values, cover: coverUrl, img: profileUrl });
        setAddOpen(false);
        setCoverPic(null);
        setProfilePic(null);
        handleFollowing();
      };
      const handleChange = (e) => {
        setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
      };

    return (
        <div className="addGroup">
                <div className="window">
                    <span>Create group</span>
                    <form>
                    <div className="input-item">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Group name" 
                            onChange={handleChange} 
                        />
                        <DriveFileRenameOutlineRoundedIcon />
                    </div> 
                    <div className="input-item">
                        <input 
                            type="text" 
                            name="description" 
                            placeholder="Group description" 
                            onChange={handleChange} 
                        />
                        <AssignmentRoundedIcon />
                    </div> 
                        <div className="item">
                            <span>Pick cover</span>
                            <DragAndDropFileInput
                                onFileSelect={(file) => setCoverPic(file)}
                                label="coverPicInput"
                            />
                        </div>
                        <div className="item">
                            <span>Pick avatar</span>
                            <DragAndDropFileInput
                                onFileSelect={(file) => setProfilePic(file)}
                                label="profilePicInput"
                            />
                        </div>
                    </form>
                    <button onClick={handleClick}>Create</button>
                </div>
            </div>
          );
}

export default AddGroup