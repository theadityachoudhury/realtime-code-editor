import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import config from '../Config';
import { handleSocketEventsRoutes } from '../Routes/Socket';

export const initializeSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: config.FRONTEND_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket) => {
        handleSocketEventsRoutes(io, socket);
    });

    return io;
};
