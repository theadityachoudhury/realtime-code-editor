import { Link } from "react-router-dom"
import { useUserContext } from "../context/UserProvider"

const Header = () => {
    const { user, logout } = useUserContext();
    return (
        <div>
            <div className="flex justify-around my-2 text-lg">
                <div>
                    <p>
                        <Link to="/">CodeSync</Link>
                    </p>
                </div>
                <div className="flex gap-5">
                    <div>
                        <Link to="/editor">Editor</Link>
                    </div>
                    <div>
                        <Link to="/chat">Chat</Link>

                    </div>
                    <div>
                        <Link to="/profile">Profile</Link>
                    </div>
                    <div>
                        <button onClick={logout} className="cursor-pointer">Logout</button>
                    </div>
                    <div>
                        <p>Welcome, {user?.name.fname}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header