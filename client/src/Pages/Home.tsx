import config from "../Config";
import PageMeta from "../Utils/PageMeta";
import { useRoom } from "../context/RoomProvider";
import { useUserContext } from "../context/UserProvider";
import {Link} from "react-router-dom";

const Home = () => {
  const { user, logout } = useUserContext();
  const { createRoom, deleteRoom, roomData } = useRoom();

  return (
    <div className="bg-gray-700 text-white min-h-screen p-6 flex flex-col overflow-hidden">
        <PageMeta title="Dashboard | CodeSync" description="CodeSync helps to collaborate on code in real-time with your team. Experience seamless, multi-user coding with our online code editor. Check out now!" canonical={`${config.FRONTEND_URL}/`} />

      <div className="">
        <div className="mb-6">
          <p className="text-4xl mb-2">Welcome, {user?.name.fname}</p>
          <div className="flex gap-1">
            <p>Not {user?.name.fname}?</p>
            <p className="cursor-pointer underline" onClick={logout}>
              Logout
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl">Rooms</h2>
          <button
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={createRoom}
          >
            Create New Room
          </button>
        </div>

        <div className="overflow-x-auto bg-gray-700 rounded-md flex-grow">
          <div className="max-h-[calc(100vh-220px)]"> {/* Adjust the height as needed */}
            <table className="min-w-full bg-gray-800 rounded-md overflow-y-auto">
              <thead>
                <tr className="bg-gray-600 text-left">
                  <th className="py-2 px-4">Room ID</th>
                  <th className="py-2 px-4">Files</th>
                  <th className="py-2 px-4">Created On</th>
                  <th className="py-2 px-4">Last Accessed On</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roomData.map((room) => (
                  <tr key={room._id} className="border-t border-gray-700">
                    <td className="py-2 px-4">{room._id}</td>
                    <td className="py-2 px-4">{room.files}</td>
                    <td className="py-2 px-4">{room.createdAt}</td>
                    <td className="py-2 px-4">{room.updatedAt}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <Link
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                        to={`/editor/${room._id}`}
                      >
                        Join Room
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => deleteRoom(room._id)}
                      >
                        Delete Room
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
