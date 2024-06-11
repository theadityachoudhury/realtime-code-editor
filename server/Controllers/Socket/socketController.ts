import { Server, Socket } from 'socket.io';

export const handleSocketEvents = (io: Server, socket: Socket) => {
  // Handle joining a room
  socket.on('joinRoom', (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // Handle editing a file
  socket.on('editFile', (data: { roomId: string, content: string }) => {
    const { roomId, content } = data;
    socket.to(roomId).emit('fileEdited', content);
  });

  // Handle sending a message
  socket.on('sendMessage', (data: { roomId: string, message: string }) => {
    const { roomId, message } = data;
    io.in(roomId).emit('newMessage', message);
  });
};
