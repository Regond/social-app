import React, {useState, useContext} from 'react';
import './addStory.scss';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../requests.js";  
import DragAndDropFileInput from '../updateUser/dragNDrop/drag.jsx';
import { AuthContext } from '../auth';

const AddStory = ({setAddStory}) => {
    const [storyPic, setStoryPic] = useState(null);
    const {currentUser} = useContext(AuthContext)   
    const queryClient = useQueryClient()

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
        mutationFn: (story) => {
          return api.post("/stories", story)
        },
        onSuccess: () => {
          queryClient.invalidateQueries("story");
        },
      });

      const handleUpdate = async (e) => {
        e.preventDefault();
        let coverUrl = await load(storyPic);
        mutation.mutate({userId: currentUser.id, img: coverUrl });
        setStoryPic(null);
        setAddStory(false);
    }

  return (
    <div className='addStory'>
        <div className="storyWindow">
              <DragAndDropFileInput
                onFileSelect={(file) => setStoryPic(file)}
                label="coverPicInput"
              />
            <button onClick={handleUpdate}>Update</button>
            <button onClick={() => setAddStory(false)}>Close</button>
        </div>
    </div>
  )
}

export default AddStory