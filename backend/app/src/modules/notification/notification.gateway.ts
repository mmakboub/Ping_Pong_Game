import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';
const userSocketMap = new Map<string, string[]>();

const configService = new ConfigService();
@WebSocketGateway({
  namespace: 'notification',
  cors: {
    origin: configService.get<string>('CORS_URL', 'http://localhost:3000')
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly notificationService: NotificationService) {}
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(client: Socket) {
    console.log(`Global socket connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Global socket Disconnected: ${client.id}`);
    userSocketMap.forEach((sockets) => {
      const index = sockets.indexOf(client.id);
      if (index >= 0) {
        sockets.splice(index, 1);
        // console.log(`Removed ${userId} with socketId ${client.id}`);
      }
    });
  }
  // @UseGuards(JwtAuthGuard)
  @SubscribeMessage('newConnection')
  handleneConnection(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (userId) {
      client.join(userId);
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, []);
      }
      userSocketMap.get(userId).push(client.id);
      // console.log(`Added ${userId} with socketId ${userSocketMap.get(userId)}`);
    }
  }

  @SubscribeMessage('newFriendRequest')
  handleNewFriendRequest(
    @MessageBody() request: { receiverId: string; senderId: string },
    // @ConnectedSocket() client: Socket,
  ) {
    this.notificationService
      .getUserByUserName(request.receiverId)
      .then((user) => {
        if (user) {
          const sockets = userSocketMap.get(user.id);
          if (sockets) {
            this.server
              .to(user.id)
              .emit('GotNewFriendRequest', request.senderId);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  @SubscribeMessage('cancelFriendRequest')
  handleCancelFriendRequest(
    @MessageBody() request: { receiverId: string; senderId: string },
    // @ConnectedSocket() client: Socket,
  ) {
    this.notificationService
      .getUserByUserName(request.receiverId)
      .then((user) => {
        if (user) {
          const sockets = userSocketMap.get(user.id);
          if (sockets) {
            this.server
              .to(user.id)
              .emit('friendRequestCanceld', request.senderId);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  @SubscribeMessage('friendRequestAccepted')
  handleFriendRequestAccepted(
    @MessageBody()
    body: {
      senderId: string;
      receiverId: string;
      roomId: string;
    },
  ) {
    let receivername = '';
    this.notificationService
      .getUserById(body.receiverId)
      .then((user) => {
        if (user) {
          receivername = user.username;
          const sockets = userSocketMap.get(body.receiverId);
          if (sockets) {
            this.server.to(body.receiverId).emit('newFriendRoom', body.roomId);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
    this.notificationService
      .getUserByUserName(body.senderId)
      .then((user) => {
        if (user) {
          const sockets = userSocketMap.get(user.id);
          if (sockets) {
            this.server.to(user.id).emit('newFriendRoom', body.roomId);
            this.server.to(user.id).emit('AcceptedNotif', receivername);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
