import { Server, Socket } from 'socket.io'
import FileModel from '../../Models/Files'

type User = {
  socket_id: string
  user_id: string
  username: string
}

type roomType = {
  room_id: string
  users: User[]
}

const rooms: roomType[] = []

// Utility Functions
const getSocketIdFromUserIdAndRoomId = (
  userId: string,
  roomId: string,
): string | undefined => {
  const room = rooms.find((room) => room.room_id === roomId)
  const user = room?.users.find((user) => user.user_id === userId)
  return user?.socket_id
}

const getUserIdFromSocketIdAndRoomId = (
  socketId: string,
  roomId: string,
): string | undefined => {
  const room = rooms.find((room) => room.room_id === roomId)
  const user = room?.users.find((user) => user.socket_id === socketId)
  return user?.user_id
}

const getRoomIdFromSocketIdAndUserId = (
  socketId: string,
  userId: string,
): string | undefined => {
  for (const room of rooms) {
    if (
      room.users.some(
        (user) => user.socket_id === socketId && user.user_id === userId,
      )
    ) {
      return room.room_id
    }
  }
  return undefined
}

const getRoomIdsFromSocketId = (socketId: string): string[] => {
  const roomIds: string[] = []
  for (const room of rooms) {
    if (room.users.some((user) => user.socket_id === socketId)) {
      roomIds.push(room.room_id)
    }
  }
  return roomIds
}

// Methods
const joinRoom = (io: Server, socket: Socket, data: any) => {
  const room = rooms.find((room) => room.room_id === data.room_id)
  const userData = {
    socket_id: socket.id,
    user_id: data.user.id,
    username: data.user.name,
  }

  if (room) {
    const userExists = room.users.some((user) => user.socket_id === socket.id)
    if (!userExists) {
      room.users.push(userData)
    }
  } else {
    rooms.push({
      room_id: data.room_id,
      users: [userData],
    })
  }

  socket.join(data.room_id)

  socket.emit('roomJoined', 'Room Joined Successfully!!')

  socket.to(data.room_id).emit('userJoined', {
    userId: data.user.id,
    username: data.user.name,
  })

  io.in(data.room_id).emit('roomUsers', {
    room_id: data.room_id,
    users: rooms.find((room) => room.room_id === data.room_id)?.users,
  })
}

const leaveRoom = (io: Server, socket: Socket, data: { currentRoom: string }) => {
  const room = rooms.find((room) => room.room_id === data.currentRoom)
  const userId = getUserIdFromSocketIdAndRoomId(socket.id, data.currentRoom)
  if (room && userId) {
    const user_name = room.users.find((user) => user.user_id === userId)
      ?.username
    room.users = room.users.filter((user) => user.socket_id !== socket.id)
    socket.to(room.room_id).emit('userLeft', { username: user_name })
    socket.leave(data.currentRoom);

    if (room.users.length === 0) {
      // Optionally, remove the room if it becomes empty
      const roomIndex = rooms.indexOf(room)
      rooms.splice(roomIndex, 1)
    } else {
      io.in(room.room_id).emit('roomUsers', {
        room_id: room.room_id,
        users: room.users,
      })
    }
  }

}

const disconnect = (io: Server, socket: Socket) => {
  const roomIds = getRoomIdsFromSocketId(socket.id)

  roomIds.forEach((roomId) => {
    const userId = getUserIdFromSocketIdAndRoomId(socket.id, roomId)
    if (userId) {
      const room = rooms.find((room) => room.room_id === roomId)
      if (room) {
        const user_name = room.users.find((user) => user.user_id === userId)
          ?.username
        room.users = room.users.filter((user) => user.socket_id !== socket.id)
        io.in(room.room_id).emit('userLeft', { username: user_name })
        socket.leave(roomId);


        if (room.users.length === 0) {
          // Optionally, remove the room if it becomes empty
          const roomIndex = rooms.indexOf(room)
          rooms.splice(roomIndex, 1)
        } else {
          io.in(room.room_id).emit('roomUsers', {
            room_id: room.room_id,
            users: room.users,
          })
        }
      }
    }
  })
}

const sendMessage = (
  io: Server,
  socket: Socket,
  data: { message: { username: string; message: string }; roomId: string },
) => {
  const { roomId, message } = data
  if (roomId) {
    socket.to(roomId).emit('messageReceived', {
      message: message.message,
      username: message.username,
    })
  }
}


const addFile = (io: Server, socket: Socket, data: { roomId: string, id: string, name: string, content: string, language: string }) => {
  socket.to(data.roomId).emit('fileAdded', {
    id: data.id,
    name: data.name,
    content: data.content,
    language: data.language
  });
}


const removeFile = (io: Server, socket: Socket, data: { roomId: string, fileId: string }) => {
  socket.to(data.roomId).emit('fileDeleted', {
    id: data.fileId
  });
}
const updateFile = async (io: Server, socket: Socket, data: { roomId: string, fileId: string, content: string, language: string }) => {
  socket.to(data.roomId).emit('fileUpdated', {
    id: data.fileId,
    content: data.content,
    language: data.language
  });
  try {
    const file = await FileModel.findById(data.fileId);
    if (file) {
      file.content = data.content;
      await file.save();
    }
  } catch (error) {
    console.log(error);
  }
}

const renameFile = (io: Server, socket: Socket, data: { roomId: string, fileId: string, name: string, language: string }) => {
  socket.to(data.roomId).emit('fileRenamed', {
    id: data.fileId,
    name: data.name,
    language: data.language
  });
};

export default {
  joinRoom,
  leaveRoom,
  disconnect,
  sendMessage,
  addFile,
  removeFile,
  updateFile,
  renameFile
}
