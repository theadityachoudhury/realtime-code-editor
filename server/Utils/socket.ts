import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import config from '../Config';
import { handleSocketEvents } from '../Controllers/Socket/socketController';

export const initializeSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: config.FRONTEND_URL,
            credentials: true,
        },
    });

    io.on('connection', (socket: Socket) => {
        console.log(`New client connected: ${socket.id}`);
        socket.emit('connection',"Socket Successfully Connected");
        handleSocketEvents(io, socket);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};
