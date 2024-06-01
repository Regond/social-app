import React, { useState, useEffect } from 'react';
import './update.scss';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../requests.js";
import DragAndDropFileInput from './dragNDrop/drag.jsx';
import { AuthContext } from '../auth';
import { useContext } from 'react';

export const Update = ({ setUpdate, user }) => {
  const [coverPic, setCoverPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const queryClient = useQueryClient();
  const { updateCurrentUser } = useContext(AuthContext);
  const [values, setValues] = useState({
    name: user?.name || "",
    city: user?.city || "",
    email: user?.email || ""
  });

  useEffect(() => {
    setValues({
      name: user?.name || "",
      city: user?.city || "",
      email: user?.email || ""
    });
  }, [user]);

  const load = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const rs = await api.post("/load", formData);
      return rs.data;
    } catch (e) {
      console.log(e);
    }
  };

  const handleChange = (e) => {
    setValues((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const mutation = useMutation({
    mutationFn: (updatedUser) => {
      return api.put("/users", updatedUser);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("user");
      const updatedUser = {
        ...user,
        ...values,
        cover: coverPic ? `${Date.now()}_${coverPic.name}` : user.cover,
        profile: profilePic ? `${Date.now()}_${profilePic.name}` : user.profile
      };
      updateCurrentUser(updatedUser);
    },
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    let coverUrl;
    let profileUrl;
    coverUrl = coverPic ? await load(coverPic) : user.cover;
    profileUrl = profilePic ? await load(profilePic) : user.profile;
    mutation.mutate({ ...values, cover: coverUrl, profile: profileUrl });
    setUpdate(false);
    setCoverPic(null);
    setProfilePic(null);
  };

  return (
    <div className='update'>
      <div className="window">
        <span>Update user</span>
        <form>
          <div className="form-container">
            <div className="item">
              <span>Update cover</span>
              <DragAndDropFileInput
                onFileSelect={(file) => setCoverPic(file)}
                label="coverPicInput"
              />
            </div>
            <div className="item">
              <span>Update profile</span>
              <DragAndDropFileInput
                onFileSelect={(file) => setProfilePic(file)}
                label="profilePicInput"
              />
            </div>
            <div className="input-item">
              <input 
                type="text" 
                name="name" 
                value={values.name} 
                placeholder="Name" 
                onChange={handleChange} 
              />
              <BadgeRoundedIcon />
            </div>        
            <div className="input-item">
              <input 
                type="text" 
                name="city" 
                value={values.city} 
                placeholder="City" 
                onChange={handleChange} 
              />
              <ApartmentRoundedIcon />
            </div>     
            <div className="input-item">
              <input 
                type="email" 
                name="email" 
                value={values.email} 
                placeholder="Email" 
                onChange={handleChange} 
              />
              <AlternateEmailRoundedIcon />
            </div>       
          </div>
        </form>
        <div className="btn-container">
          <button onClick={handleUpdate}>Update</button>
          <button className="close" onClick={() => setUpdate(false)}>✖</button>
        </div>
      </div>
    </div>
  );
};

export default Update;
