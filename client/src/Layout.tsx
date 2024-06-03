import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { User, useUserContext } from "./context/UserProvider";
import Loader from "./Components/Loader";
import Header from "./Components/Header";
import Footer from "./Components/Footer";


const Layout: React.FC = () => {
    const { user, ready, authenticated }: { user: User | null, ready: Boolean, authenticated: Boolean } = useUserContext();
    const callbackurl = window.location.pathname;

    if (!ready) {
        return <Loader size={48}/>;
    }

    if (!authenticated || !user) {
        console.log(callbackurl);
        return <Navigate to={`/login?callback=${callbackurl}`} />;
    }

    if (!user.verified) {
        return <Navigate to={`/verify?callback=${callbackurl}`} />;
    }

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;
