import { Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Layout from "./Layout"
import Editor from "./Pages/Editor"
import Chat from "./Pages/Chat"
import Profile from "./Pages/Profile"
import Logout from "./Pages/Logout"
import Forget from "./Pages/Forget"
import Verify from "./Pages/Verify"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/verify" element={<Verify />} />

        </Route>

        <Route path="/">
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forget />} />

        </Route>

      </Routes>
    </>
  )
}

export default App
