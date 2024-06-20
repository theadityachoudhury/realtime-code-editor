import { useRoom } from "../../context/RoomProvider"

const UsersList = () => {
    const { usersInRoom } = useRoom();

    const colors = ['bg-red-700', 'bg-blue-700', 'bg-green-700', 'bg-yellow-700', 'bg-indigo-700', 'bg-purple-700', 'bg-pink-700'];

    return (
        <div className="text-black min-w-64 max-w-full h-full">
            <div className="space-y-2">
                <p className="text-3xl text-white font-poppins font-thin">
                    Users List
                </p>
                <hr />
            </div>

            <div className="overflow-y-auto max-h-96 p-2">
                <div className="grid grid-cols-2 gap-4">
                    {usersInRoom.map((user, index) => (
                        <div key={index} className="text-center">
                            <div className={`text-3xl ${colors[Math.floor(Math.random() * colors.length)]} font-bold font-mono rounded-md p-1 px-3`}>
                                {user.username[0].toLowerCase()}
                            </div>
                            <p className="text-lg text-white">{user.username}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UsersList
