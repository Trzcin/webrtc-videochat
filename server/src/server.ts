import express from 'express';
import { Server } from 'http';
import { ExpressPeerServer } from 'peer';
import { Server as WSServer } from 'socket.io';
import cors from 'cors';
import roomRouter from './roomRouter';
import { PrismaClient } from '@prisma/client';

//init
const app = express();
const httpServer = new Server(app);
const io = new WSServer(httpServer, {
  cors: {
    origin: '*',
  },
});
const peerServer = ExpressPeerServer(httpServer, {
  port: 9000,
});

//db
const prisma = new PrismaClient();

//express middleware
app.use(
  cors({
    origin: '*',
  })
);
app.use('/peerjs', peerServer);
app.use(express.json());

//routes
app.use('/', roomRouter);

//websockets
io.on('connection', (socket) => {
  socket.on('join-room', async (roomId: string, username: string) => {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        users: true,
      },
    });

    if (!room) {
      console.log('invalid room id');

      socket.emit('invalid-id');

      return;
    }

    const { id, name } = await prisma.user.create({
      data: {
        id: socket.id,
        name: username,
        room: {
          connect: {
            id: roomId,
          },
        },
      },
    });

    socket.on('video-change', (enabled: boolean) => {
      socket.to(roomId).emit('video-changed', id, enabled);
    });

    socket.emit('init', room.name, [...room.users, { id, name, roomId }]);

    //join room and update list of rooms
    socket.join(roomId);

    //emit user connected event
    socket.to(roomId).emit('user-connected', { id, name });

    //handle disconnection
    socket.on('disconnecting', async () => {
      socket.to(roomId).emit('user-disconnected', { id, name });

      //remove user from list of rooms
      await prisma.user.delete({
        where: {
          id: socket.id,
        },
      });

      //delete room if all users left
      const userCount = await prisma.user.count({ where: { roomId: roomId } });
      if (userCount === 0) {
        await prisma.room.delete({ where: { id: roomId } });
      }
    });
  });
});

//start server
httpServer.listen(5000);
console.log(`Server listening on port ${5000}`);
