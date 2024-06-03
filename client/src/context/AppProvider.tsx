import RouterProvider from "./RouterProvider";
import { UserContextProvider } from "./UserProvider";

function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <RouterProvider>
                {children}
            </RouterProvider>
        </UserContextProvider>

    )
};

export default AppProvider;