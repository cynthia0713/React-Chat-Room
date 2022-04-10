import { auth } from "./firebase";
import Axios from 'axios'; 
// import { useCookies } from 'react-cookie';
import { API_HOST } from "./public/const";

//Login Check - check if user is logged in
//cookie param verify cookie
export const loginChecker = async (sessionCookie) => {
  const result = await Axios.post(`${API_HOST}/api/login/check`, {sessionCookie});
  return result.data; 
}