import React from 'react';
import {Link} from "react-router-dom";
import { useContext, useState } from "react";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { AuthContext } from'../auth.js';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import WallpaperOutlinedIcon from '@mui/icons-material/WallpaperOutlined';
import { api } from "../../requests.js";  
import "./addPost.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddGroupPost = ({group}) => {
    const { currentUser } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const [description, setDesc] = useState("");
    const queryClient = useQueryClient();
    console.log()
    const load = async () => {
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
        mutationFn: (newPost) => {
          console.log(newPost)
          return api.post("/groupsPost", newPost)

        },
        onSuccess: () => {
          queryClient.invalidateQueries("groupsPost");
        },
      });
      



    const handleClick = async (e) => {
        e.preventDefault();
        let picUrl = "";
        if(file) picUrl = await load();
        mutation.mutate({ description, img: picUrl, id: group[0].id});
        setDesc("")
        setFile(null)
      };


    return (
        <div className="share">
            <div className="container">
            <div className="top">
                <div className="left">
                  <div className="cover">
                    <EditNoteOutlinedIcon className='write'/>
                  </div>
                  <input
                      type="text"
                      placeholder={`Post to ${group[0].name}`}
                      onChange={(e) => setDesc(e.target.value)}
                      value={description}
                  />
                </div>
                <div className="right">
                {file && (
                    <img className="file" alt="" src={URL.createObjectURL(file)} />
                )}
                </div>
            </div>

                <div className="bottom">
                  <div className="left">
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                    <label htmlFor="file">
                      <div className="item">
                        <WallpaperOutlinedIcon className='image'/>
                      </div>
                    </label>
                    <VideoCallOutlinedIcon className='video'/>
                  </div>
                  <div className="right">
                    <button onClick={handleClick}>Share</button>
                  </div>
                </div>
              </div>
            </div>
          );
}

export default AddGroupPost