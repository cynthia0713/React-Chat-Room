import { useState, useEffect } from 'react'; 
import { useCookies } from 'react-cookie';
import { loginChecker } from '../../login_check';
import { useNavigate } from 'react-router-dom'
import './stylesheet/user.css';
import { auth } from '../../firebase'; 
import Axios from 'axios';
import { API_HOST } from '../../public/const';
import { io } from 'socket.io-client';
import Chat from './components/Chat';
import { Context } from '../../context';

let socket; 
socket = io.connect(API_HOST, {forceNew: true})

const Users = () => {

  const [cookie, setCookie, removeCookie] = useCookies(); 
  const [userInfo, setUserInfo] = useState({
    name: "", 
    email: ""
  }); 

  const [chatTarget, setChatTarget] = useState({})

  const navigate = useNavigate()
  const [users, setUsers] = useState({}); 
  const [allChats, setAllChats] = useState({});
  const [readMsg, setReadMsg] = useState({})

  const sortName = (name1, name2) => {
    return [name1,name2].sort().join("-")
  }

  const signOut = async () => {
    await auth.signOut(); 
    removeCookie("lsc"); 
    const result = await Axios.post(`${API_HOST}/api/signout`, {cookie: cookie.lsc.data})
    if(result.data === "Sign Out"){
      navigate("/")
    }else{
      console.log("Signout Failed")
    }
    socket.disconnect();
    //remove socket
  }
  console.log(allChats)
  console.log(readMsg)

  useEffect(() => {
    // console.log(cookie.lsc.data)
    const checker = async () => {
      if(cookie.lsc){
        const result = await loginChecker(cookie.lsc.data) // post cookie data to backend
        if(result === "Failed"){
          removeCookie("lsc")
          navigate("/")
        }else{
          setUserInfo({name: result.name,  email: result.email})
          socket.emit('new_user', {name: result.name,  email: result.email}) //send data
          //取得所有user
          socket.on("all_users", users=> {
            //刪掉自己 - delete (js keyword)
            delete users[result.email]
            setUsers(users)
          })
        }
      }else{
        removeCookie("lsc");
        navigate("/")
      }
    }
    checker()
    socket.on('chatting', rMsg => {
      // console.log(rMsg)
      setAllChats(prev=>{
        const tempList = {...prev}
        const room = sortName(rMsg.sender.email, rMsg.receiver.email) //a-b
        if(room in tempList){
          tempList[room] = [...tempList[room], rMsg] // 聊天內容Array
        }else{
          tempList[room] = [rMsg]; // if room not created, create room and put in message
        }
        return {...tempList}
      })
    }) //rMsg = receive message
  }, [])

  return (
    <Context.Provider value={{
      userInfo,
      socket
    }}>
    <div className='user-info'>
      <h4>Hello, {userInfo.name}</h4>
      <button id='logoutBtn' onClick={signOut}>Logout</button>
    </div>
     <div className="users-container">
       {/* props => 傳遞資料 */ }
      { 
        chatTarget.email ? 
        <Chat 
          chatTarget={chatTarget} 
          setChatTarget={setChatTarget} 
          sortName={sortName}
          allChats={allChats}
          setAllChats={setAllChats}
          setReadMsg={setReadMsg}
          readMsg={readMsg}
        /> :  
        <ul>
          {Object.values(users).map(user=> <li 
          key={user.socketID} 
          onClick={()=> {setChatTarget(user)}} >
            {user.name}
            <span>{
            sortName(user.email, userInfo.email) in readMsg? 
            allChats[sortName(user.email, userInfo.email)].length - readMsg[sortName(user.email, userInfo.email)]
            : 
            allChats[sortName(user.email, userInfo.email)] ? allChats[sortName(user.email, userInfo.email)].length: 0}</span>
            </li>)}
        </ul>
      }
    </div>
    </Context.Provider>
   
  )
}

export default Users; 


// user A <-> user B
// create ROOM ==> ['haha', 'hehe', 'kaka']