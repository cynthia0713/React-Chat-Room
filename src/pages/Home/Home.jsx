import './stylesheet/home.css';
import {useState, useEffect} from 'react'; 
import { auth } from '../../firebase';
//firebase built-in method
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import { useCookies } from 'react-cookie';
import Axios from 'axios';
import { loginChecker } from '../../login_check';

const Home = () => {
  //Email and Password
  const [user, setUser] = useState({
    email: "", 
    password: ""
  });

  const [cookie, setCookie, removeCookie] = useCookies();

  const navigate = useNavigate(); 

  const emailChange = (evt) => {
    //改變值要set
    setUser({...user, ['email']:evt.target.value})
  }

  const pwChange = (evt) => {
    setUser({...user, ['password']:evt.target.value})
  }

  const signIn = () => {
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(async user => {
        console.log("Success", user)
        const token = await user.user.getIdToken(); 
        const sessionCookie = await Axios.post("http://localhost:8000/api/signin", { token })
        console.log(sessionCookie.data)
        setCookie("lsc", sessionCookie, {
          path: "/", 
          maxAge: 60*60*24*7
        })
        navigate("/users")
      })
      .catch(err => {
        console.log(err)
      })
  }

  const goToSignUp = () => {
    navigate('/signup')
  }

  useEffect(() => {
    const checker = async() => {
      if(cookie.lsc){
        const result = await loginChecker(cookie.lsc.data) 
        if(result === "Failed"){
          removeCookie("lsc")
        }else{
          navigate("/users")
        }
      }else{
        removeCookie("lsc")
      }
      
    }
    checker()
  }, [])

  return (
    <div className="sign-in">   
      <h1>Sign In</h1>
      <input type="text" placeholder="Email" value={user.email} onChange={emailChange} />
      <input type="password" placeholder="Password" value={user.password} onChange={pwChange}/>
      <button id='signinBtn' onClick={signIn}>Sign In</button>
      <button onClick={goToSignUp}>Sign Up</button>
    </div>
  )
}

export default Home; 

//Front (Token) ==> post to backend 
//Back (Token) ==> communicate with firebase
//firebase authenticate and save to (session-cookie) ==> send to back 
//back (session-cookie) ==> send to front
//front (session-cookie) ==> saved to cookie