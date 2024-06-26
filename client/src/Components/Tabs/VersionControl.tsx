import { Link } from "react-router-dom";
import { useVersionControl } from "../../context/VersionControlProvider";
import { useRoom } from "../../context/RoomProvider";

const VersionControl = () => {
    const { stageChanges, vcsOutput, commitChanges, refreshData, commits } = useVersionControl();
    const { currentRoom } = useRoom();
    return (
        <div className="text-white min-w-72 max-w-72 h-full flex flex-col space-y-2">
            <div className="space-y-2">
                <p className="text-3xl font-poppins font-thin">
                    Version Control
                </p>
                <hr />
            </div>

            <div className="p-2">
                <div className="grid grid-cols-2 gap-2">
                    <button className="text-md bg-blue-600 p-1 rounded-md hover:bg-blue-700" onClick={stageChanges}>Stage Changes</button>
                    <button className="text-md bg-red-600 p-1 rounded-md hover:bg-red-700" onClick={commitChanges}>Commit Changes</button>
                </div>
            </div>

            <div className="p-2 flex-grow space-y-2 overflow-auto">
                <div className="flex">
                    <h1 className="text-xl p-2 flex-grow">Commit History</h1>
                    <button className="text-xl bg-gray-900 p-2 rounded-md hover:bg-gray-950" onClick={refreshData}>Refresh</button>
                </div>
                <div className="space-y-1">
                    {commits.map((commit, index) => {
                        return (
                            <div key={index} className="text-md bg-gray-700 rounded-lg p-2">
                                <Link to={`/vcs/commit/${currentRoom}/${commit._id}`} target="_blank">
                                    {commit._id} - {commit.message}
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <div className="">
                    Output:
                </div>
                <div className="bg-gray-700 min-h-36 max-h-56 p-2 text-lg rounded-lg overflow-y-auto">
                    {/* Output here */}
                    {vcsOutput}
                </div>
            </div>
        </div>
    );
};

export default VersionControl;
