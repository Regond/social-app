import React from 'react'
import { ChatEngine,ChatList, MultiChatSocket, MultiChatWindow, useMultiChatLogic } from 'react-chat-engine-advanced';

const UserChat = ({user}) => {
    const chatInit = useMultiChatLogic('fc42bc2c-837a-401b-b5b4-5cfbd0b9254b', user.username, user.password)
    return (
      <div style={{ height: '100vh'}}>
        <MultiChatSocket {...chatInit}/>
        <MultiChatWindow 
        {...chatInit} 
        style={{ height: '100%'}}

        />
      </div>
	);
  }
  
  export default UserChat
