import { Route, Routes } from "react-router-dom"
import Login from "./Pages/Login"
import Register from "./Pages/Register"
import Layout from "./Layout"
import Editor from "./Pages/Editor"
import Forget from "./Pages/Forget"
import Verify from "./Pages/Verify"


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Editor />} />
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
