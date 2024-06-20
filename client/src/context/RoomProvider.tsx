import React, { createContext, useContext, useEffect, useState } from 'react';
import instance from '../axios';
import useToast from '../Hooks/useToast';
import handleServerResponse from '../Utils/serverMessages';
import { useUserContext } from "./UserProvider";
import { useSocket } from './SocketProvider';

type RoomData = {
    _id: string;
    files: number;
    createdAt: string;
    updatedAt: string;
};

type UserInRoom = {
    socket_id: string;
    user_id: string;
    username: string;
};

type RoomType = {
    room_id: string;
    users: UserInRoom[];
};

type RoomContextType = {
    roomData: RoomData[];
    inRoom: boolean;
    currentRoom: string | null;
    createRoom: () => void;
    joinRoom: (roomId: string) => void;
    deleteRoom: (roomId: string) => void;
    isValidRoom: (roomId: string) => Promise<boolean>;
    usersInRoom: UserInRoom[];
};


const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([]);
    const { toastSuccess, toastError } = useToast();
    const [roomData, setRoomData] = useState<RoomData[]>([]);
    const [inRoom, setInRoom] = useState<boolean>(false);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);
    const { authenticated, user } = useUserContext();
    const { socket } = useSocket();

    console.log(usersInRoom);

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
        if (authenticated) fetchRooms();
    }, [authenticated]);

    useEffect(() => {
        if (socket) {
            socket.on('roomJoined', (data: string) => {
                toastSuccess(data);
            });
            socket.on('roomUsers', (data: RoomType) => {
                setUsersInRoom(data.users);
            });
            socket.on('userJoined', (data: { userId: string; username: string }) => {
                toastSuccess(`${data.username} joined the room`);
            });
            socket.on('userLeft', (user: { username: string }) => {
                toastSuccess(`${user.username} left the room`);
            });
        }

        return () => {
            if (socket) {
                socket.off('roomJoined');
                socket.off('roomUsers');
                socket.off('userJoined');
                socket.off('userLeft');
            }
        };
    }, [socket]);

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

    const joinRoom = async (roomId: string) => {
        console.log(roomId);
        setInRoom(true);
        setCurrentRoom(roomId);
        socket.emit('joinRoom', {
            room_id: roomId, user: {
                name: user?.name.fname as string,
                id: user?._id as string
            }
        });
    };

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
            return data.status === 200;
        } catch (err) {
            toastError("Unable to connect to the server!!");
            return false;
        }
    };

    const value = {
        roomData,
        inRoom,
        currentRoom,
        createRoom,
        joinRoom,
        deleteRoom,
        isValidRoom,
        usersInRoom,
    };

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export const useRoom = (): RoomContextType => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
};
