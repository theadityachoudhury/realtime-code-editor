import { Link } from "react-router-dom"

const Header = () => {
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
                        <Link to="/logout">Logout</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header