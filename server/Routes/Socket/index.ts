import { Server, Socket } from "socket.io";

import SocketController from "../../Controllers/Socket";


export const handleSocketEventsRoutes = (io: Server, socket: Socket) => {
    socket.on('joinRoom', (data) => SocketController.joinRoom(io, socket, data));
    socket.on('disconnect', () => SocketController.disconnect(io, socket));

}