import './stylesheet/signup.css'; 
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'

const Sign_Up = () => {

  const [userInfo, setUserInfo] = useState({
    email: "", 
    name: "", 
    password: "", 
    confirm: ""
  })

  const navigate = useNavigate();

  const signIn = () => {
    navigate('/')
  }

  const signUp = () => {
    if(userInfo.password === userInfo.confirm){
      createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then(data => {
          console.log("Success", data)
          updateProfile(data.user, {
            displayName: userInfo.name
          })
          navigate("/")
        })
        .catch(err => {
          console.log(err)
          alert("註冊失敗")
        })
    }else{
      alert("passwords do not match")
    }
  }

  return (
    <div className='sign-up'>
      <h1>Sign Up</h1>
      <input type="text" placeholder='Email' value={userInfo.email} onChange={(evt) => {
        setUserInfo({...userInfo, ['email']:evt.target.value})
      } } />
      <input type="text" placeholder='Name' value={userInfo.name} onChange={(evt) => {
        setUserInfo({...userInfo, ['name']:evt.target.value})
      } }/>
      <input type="password" autoComplete='new-password' placeholder='Password' value={userInfo.password} onChange={(evt) => {
        setUserInfo({...userInfo, ['password']:evt.target.value})
      } }/>
      <input type="password" autoComplete='new-password' placeholder='Confirm Password' value={userInfo.confirm} onChange={(evt) => {
        setUserInfo({...userInfo, ['confirm']:evt.target.value})
      } } />
      <button id='signupBtn' onClick={signUp}>SignUp</button>
      <button onClick={signIn}>Sign In</button>
    </div>
  )
}

export default Sign_Up; 