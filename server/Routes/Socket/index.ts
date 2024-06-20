import { Server, Socket } from "socket.io";

import SocketController from "../../Controllers/Socket";


export const handleSocketEventsRoutes = (io: Server, socket: Socket) => {
    // Room Events
    socket.on('joinRoom', (data) => SocketController.joinRoom(io, socket, data));
    socket.on('disconnect', () => SocketController.disconnect(io, socket));

    //File Events
    socket.on('addFile', (data) => SocketController.addFile(io, socket, data));
    socket.on('removeFile', (data) => SocketController.removeFile(io, socket, data));
    socket.on('updateFile', (data) => SocketController.updateFile(io, socket, data));

    // Message Events
    socket.on('sendMessage', (data) => SocketController.sendMessage(io, socket, data));

}