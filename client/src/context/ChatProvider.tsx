import React, { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";
import { useRoom } from "./RoomProvider";

type Message = {
    username: string;
    message: string;
};

type ChatContextType = {
    messages: Message[];
    sendMessage: (message: Message) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { socket } = useSocket();
    const { currentRoom } = useRoom();
    const [messages, setMessages] = useState<Message[]>([]);

    console.log(messages);

    const sendMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        socket.emit("sendMessage", { message, roomId: currentRoom }); // Replace with your socket event name
    };

    // Assuming socket event to receive messages
    useEffect(() => {
        socket.on("messageReceived", (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("messageReceived");
        }
    }, [socket]);

    const value: ChatContextType = {
        messages,
        sendMessage,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};
