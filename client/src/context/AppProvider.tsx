import { CodeEditorProvider } from "./CodeEditorProvider";
import { FileProvider } from "./FileProvider";
import RouterProvider from "./RouterProvider";
import { UserContextProvider } from "./UserProvider";

function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <CodeEditorProvider>
                <FileProvider>
                    <RouterProvider>
                        {children}
                    </RouterProvider>
                </FileProvider>
            </CodeEditorProvider>
        </UserContextProvider>

    )
};

export default AppProvider;