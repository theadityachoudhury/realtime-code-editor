import { ChatProvider } from "./ChatProvider";
import { CodeEditorProvider } from "./CodeEditorProvider";
import { FileProvider } from "./FileProvider";
import { RoomProvider } from "./RoomProvider";
import RouterProvider from "./RouterProvider";
import { RunnerProvider } from "./RunnerProvider";
import { SocketProvider } from "./SocketProvider";
import { UserContextProvider } from "./UserProvider";
import { VersionControlProvider } from "./VersionControlProvider";

function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <UserContextProvider>
            <SocketProvider>
                <RoomProvider>
                    <VersionControlProvider>
                        <ChatProvider>
                            <CodeEditorProvider>
                                <FileProvider>
                                    <RunnerProvider>
                                        <RouterProvider>
                                            {children}
                                        </RouterProvider>
                                    </RunnerProvider>
                                </FileProvider>
                            </CodeEditorProvider>
                        </ChatProvider>
                    </VersionControlProvider>
                </RoomProvider>
            </SocketProvider>
        </UserContextProvider>

    )
};

export default AppProvider;