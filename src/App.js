import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from "./pages/Home/Home";
import Sign_Up from "./pages/Sign_Up/Sign_Up";
import Users from "./pages/Users/User";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} exact />
      <Route path="/signup" element={<Sign_Up />} exact/>
      <Route path="/users"element={<Users />} exact/>
    </Routes>
    </BrowserRouter>
    
  )
}
export default App; 

// "/" => sign in 
// "/signup" => signup 
// "/users" => users 
// "/users/chat" => chat 