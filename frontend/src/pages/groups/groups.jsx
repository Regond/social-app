import React, { useContext, useState } from 'react';
import { Link } from "react-router-dom";
import './groups.scss';
import AddGroup from '../../components/addGroup/addGroup.jsx';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { api } from '../../requests.js';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';  
import { AuthContext } from '../../components/auth.js';

const Groups = () => {
  const { currentUser } = useContext(AuthContext);
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const queryClient = useQueryClient();

  const { isPending, data: groupData } = useQuery({
    queryKey: ['group'],
    queryFn: () => api.get("/groups/").then(res => res.data)
  });

  const { isLoading, data: searchData } = useQuery({
    queryKey: ['groupName', searchQuery],
    queryFn: () => api.get(`/groups/findName/`+groupName).then(res => res.data),
    enabled: !!searchQuery
  });
console.log(searchData);
  const handleSearch = () => {
    setSearchQuery(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (groupId) => {
      return api.delete("/groups/" + groupId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("groups"); // Исправлено, чтобы правильно обновлять кеш после удаления группы
    },
  });

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className='groups'>
      <h4>Groups</h4>
      <div className="searchBar">
        <SearchSharpIcon className='searchIcon' />
        <input
          type="text"
          placeholder='Start typing or search...'
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <button className='find' onClick={handleSearch}>Find</button>
        <button className='add' onClick={() => setAddOpen(true)}>Add group</button>
      </div>
      <div className="container">
        {isPending ? "loading" : (
          (searchQuery && searchData ? searchData : groupData).map(group => (
            <div className="item" key={group.id} id={group.id}>
              <img src={`/files/${group.img}`} alt="" />
              <div className="info">
                <Link to={`/group/${group.id}`} style={{ textDecoration: 'none' }}>
                  <span className='name'>{group.name}</span>
                </Link>
                <span className='desc'>{group.description}</span>
                <span className='members'>
                  <GroupsOutlinedIcon />
                  {group.members ? group.members.length : 0} members
                </span>
              </div>
              {group.adminId === currentUser.id && (
                <DeleteRoundedIcon onClick={() => handleDelete(group.id)} className='delete' />
              )}
            </div>
          ))
        )}
      </div>
      {addOpen && <AddGroup setAddOpen={setAddOpen} />}
    </div>
  );
};

export default Groups;
