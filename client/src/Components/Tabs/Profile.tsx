import { useUserContext } from "../../context/UserProvider"; // Assuming this context exists
import Loader from "../Loader";

const ProfilePage = () => {
    const { user } = useUserContext(); // Assuming user context provides user details

    if (!user) {
        return <Loader /> // Handle loading state if user data is asynchronously fetched
    }

    return (
        <div className="text-black min-w-72 max-w-72 h-full flex flex-col">
            <div className="space-y-2">
                <p className="text-3xl text-white font-poppins font-thin">Profile</p>
                <hr />
            </div>

            <div className="">
                <div className="bg-gray-800 text-white rounded-md p-4">
                    <div>
                        <p className="text-lg font-semibold">Name</p>
                        <p>{`${user.name.fname} ${user.name.lname}`}</p>
                    </div>
                    <div>
                        <p className="text-lg">Email</p>
                        <p>{user.email}</p>
                    </div>
                </div>

                <button className="mt-4 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
