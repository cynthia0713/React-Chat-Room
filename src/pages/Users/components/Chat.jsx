import { useState, useEffect, useContext } from "react"; 
import { Context } from "../../../context";
import { v4 } from 'uuid';
import ScrollToBottom from 'react-scroll-to-bottom';

const Chat = ({chatTarget, setChatTarget, sortName, setAllChats, allChats, readMsg, setReadMsg}) => {
  const me = useContext(Context).userInfo //me = userInfo
  const socket = useContext(Context).socket; 
  const [chatMsg, setChatMsg] = useState(''); 
  const myRoom = sortName(chatTarget.email, me.email); 

  useEffect (() => {
    //記錄讀取訊息
    setReadMsg(prev=>{
      const tempList = {...prev}; 
      if(myRoom in allChats){
        //room 存在
        tempList[myRoom] = allChats[myRoom].length //打開順間有多少訊息
        return {...tempList}
      }
      return {...tempList}

    })

  }, [allChats])
  console.log(readMsg)
  
  const sendMsg = (evt) => {
    evt.preventDefault(); 

    if(chatMsg){ //if chatMsg !== ""
      //傳遞的包裹
      const msgData = {
        sender: me, 
        receiver: chatTarget, 
        msg: chatMsg, 
        msgID: v4()
      }
      
      socket.emit('new_msg', msgData); 

      //自己送出的
      setAllChats(prev => {
        const tempList = {...prev}; 
        const room = sortName(me.email, chatTarget.email); 
        if(room in tempList){
          tempList[room] = [...tempList[room], msgData] // 聊天內容Array
        }else{
          tempList[room] = [msgData]; // if room not created, create room and put in message
        }
        return {...tempList}
      })
    }
    setChatMsg('')
  }
  console.log(chatMsg)

  return (
    <div className='chat-container'>
      <div className="chat-header">
        <button onClick={() => {setChatTarget({})}}>Back</button>
        <h2>{chatTarget.name}</h2>
      </div>
      <ScrollToBottom className="message-container">
        {/* A-B - MAP */}
        {
          myRoom in allChats ? 
            allChats[myRoom].map((msg, idx) => <div key={msg.msgID} className="message" id={msg.sender.email === me.email? 'right': 'left'}>
            <h4 style={{display: idx > 0 ? (allChats[myRoom][idx-1].sender.email === msg.sender.email?'none':'block'):'block'}} >{msg.sender.name}</h4>
            <p>{msg.msg}</p>
          </div>): ''
        }

      </ScrollToBottom>
      <div className="chat-footer">
        <form onSubmit={sendMsg} action="">
          <input onChange={evt => {setChatMsg(evt.target.value)}} value={chatMsg}  className="myMessage" type="text" placeholder="Enter a message" />
          <input className="sendBtn" type="submit" value="Send" />
        </form>
      </div>
    </div>
  )
}

export default Chat;