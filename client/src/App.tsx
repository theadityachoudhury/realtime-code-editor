import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Layout from "./Layout"
import Editor from "./Pages/Editor"
import Forget from "./Pages/Forget"
import Verify from "./Pages/Verify"
import Home from "./Pages/Home"
import CommitHistory from "./Pages/CommitHistory"
import Logout from "./Pages/Logout"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/vcs/commit/:id/:commitId" element={<CommitHistory />} />
        </Route>

        <Route path="/">
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forget />} />
          <Route path="/logout" element={<Logout />} />

        </Route>

      </Routes>
    </>
  )
}

export default App
