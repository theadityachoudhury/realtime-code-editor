import { CodeEditorProvider } from "./CodeEditorProvider";
import { FileProvider } from "./FileProvider";
import RouterProvider from "./RouterProvider";
import { RunnerProvider } from "./RunnerProvider";
import { UserContextProvider } from "./UserProvider";

function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <CodeEditorProvider>
                <FileProvider>
                    <RunnerProvider>
                        <RouterProvider>
                            {children}
                        </RouterProvider>
                    </RunnerProvider>
                </FileProvider>
            </CodeEditorProvider>
        </UserContextProvider>

    )
};

export default AppProvider;