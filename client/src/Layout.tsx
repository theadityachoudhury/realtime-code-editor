import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { User, useUserContext } from "./context/UserProvider";
import Loader from "./Components/Loader";
import Header from "./Components/Header";
import Footer from "./Components/Footer";


const Layout: React.FC = () => {
    const { user, ready, authenticated }: { user: User | null, ready: Boolean, authenticated: Boolean } = useUserContext();

    const { pathname, search } = useLocation();

    if (!ready) {
        return <Loader size={48} />;
    }

    if (!authenticated || !user) {
        return <Navigate to={`/login?callback=${search ? search.split("=")[1] : pathname}`} />;
    }

    if (!user.verified) {
        if (window.location.pathname != "/verify")
            return <Navigate to={`/verify?callback=${pathname}`} />;
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
