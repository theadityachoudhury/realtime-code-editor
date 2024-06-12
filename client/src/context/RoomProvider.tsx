import React, { createContext, useContext, useEffect, useState } from 'react';
import instance from '../axios';
import useToast from '../Hooks/useToast';
import handleServerResponse from '../Utils/serverMessages';
import { useUserContext } from "./UserProvider.tsx";

// Define the type for room data
type RoomData = {
    _id: string;
    files: number;
    createdAt: string;
    updatedAt: string;
};

// Define the type for the RoomProvider context
type RoomContextType = {
    roomData: RoomData[];
    inRoom: boolean;
    currentRoom: RoomData | null;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
    deleteRoom: (roomId: string) => void;
    isValidRoom: (roomId: string) => Promise<boolean>;
};

// Create the context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

// Define the RoomProvider component
export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { toastSuccess, toastError } = useToast();
    const [roomData, setRoomData] = useState<RoomData[]>([]);
    const [inRoom, setInRoom] = useState<boolean>(false);
    const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
    const { authenticated } = useUserContext();

    async function fetchRooms() {
        try {
            const { data } = await instance.get('/api/code/room');
            if (data.status === 200) {
                setRoomData(data.data);
            } else {
                toastError(handleServerResponse(data.reason));
            }

        } catch (error) {
            toastError('Error fetching rooms');
            toastError("Check your internet connection and try again!");
        }
    }

    useEffect(() => {
        if (authenticated)
            fetchRooms();
    }, [authenticated])

    // Function to create a new room
    const createRoom = async () => {
        try {
            const { data } = await instance.post('/api/code/room');
            if (data.status === 201) {
                setRoomData(prevRoomData => [...prevRoomData, data.data]);
                toastSuccess(handleServerResponse(data.reason));
            } else {
                toastError(handleServerResponse(data.reason));
            }
        } catch (error) {
            toastError('Error creating rooms');
            toastError("Check your internet connection and try again!");
        }
    };

    // Function to join a room
    const joinRoom = async (roomId: string) => {
        // Assume implementation for joining room
        setInRoom(true);
        setCurrentRoom(roomData.find(room => room._id === roomId) || null);
    };

    // Function to delete a room
    const deleteRoom = async (roomId: string) => {
        try {
            const { data } = await instance.delete(`/api/code/room/${roomId}`);
            if (data.status === 200) {
                setRoomData(prevRoomData => prevRoomData.filter(room => room._id !== roomId));
                toastSuccess(handleServerResponse(data.reason));
            } else {
                toastError(handleServerResponse(data.reason));
            }
        } catch (error) {
            console.error('Error deleting room:', error);
            toastError("Check your internet connection and try again!");
        }
    };

    const isValidRoom = async (roomId: string) => {
        try {
            const { data } = await instance.get(`/api/code/room/${roomId}`);
            if (data.status === 200) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            toastError("Unable to connect to the server!!");
            return false;
        }
    }


    const value = {
        roomData,
        inRoom,
        currentRoom,
        createRoom,
        joinRoom,
        deleteRoom,
        isValidRoom,
    };

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

// Custom hook to use the Room context
export const useRoom = (): RoomContextType => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
};
