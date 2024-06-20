import React, { createContext, useContext, useEffect, useMemo } from "react"
import { Socket, io } from "socket.io-client";
import config from "../Config";

type SocketContextType = {
    socket: Socket;

}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

type SocketProviderProps = {
    children: React.ReactNode;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const socket: Socket = useMemo(() => io(config.BACKEND_URL), []);

    useEffect(() => {
        socket.on("connection", (gg) => console.log(gg));

        return () => {
            socket.off("connection");
        }
    }, [])


    return (
        <SocketContext.Provider
            value={{ socket }}
        >
            {children}
        </SocketContext.Provider>
    );
}

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};