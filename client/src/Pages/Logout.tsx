import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserProvider";
import { Navigate } from "react-router-dom";
import Loader from "../Components/Loader";
import sleep from "../Utils/Sleep";


const Logout = () => {
  const { logout, ready, authenticated } = useUserContext();
  const [redirect, setRedirect] = useState<boolean>(false);

  useEffect(() => {
    const handleLogout = async () => {
      await sleep(5000);
      logout();
      setRedirect(true);
    };
    handleLogout();
  }, [logout]);

  if (redirect) {
    return <Navigate to="/login" />;
  }

  if (!ready) {
    return <Loader fullScreen={true} size={50} />
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-2xl">
        <div>
          {authenticated && <Loader size={50} />}
        </div>
        <div>
          {authenticated ? "Logging you Out!!" : "You are already logged out!!"}
        </div>
      </div>
    </div>
  );
};

export default Logout;
