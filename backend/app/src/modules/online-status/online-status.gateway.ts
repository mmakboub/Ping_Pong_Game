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
import { ConfigService } from '@nestjs/config';

const userSocketMap = new Map<string, { status: string; sockets: string[] }>();
const configService = new ConfigService();

@WebSocketGateway({
  namespace: 'online-status',
  cors: {
    origin: configService.get<string>('CORS_URL', 'http://localhost:3000')
  },
})
export class OnlineStatusGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: any) {
    console.log(server);
  }

  handleConnection(client: any) {
    console.log(`OnlineStatusGateway connected: ${client.id}`);
  }


  handleDisconnect(client: any) {
    console.log(`OnlineStatusGateway disconnected: ${client.id}`);
    for (const [userId, { status, sockets }] of userSocketMap.entries()) {
      const index = sockets.indexOf(client.id);
      if (index >= 0) {
        sockets.splice(index, 1);

        if (sockets.length === 0) {
          userSocketMap.set(userId, { status: 'offline', sockets: [] });
        }
        if (status === 'in-game' && sockets.length > 0)
          userSocketMap.set(userId, { status: 'online', sockets });
        const userStatusArray = Array.from(userSocketMap.entries()).map(
          ([userId, { status }]) => ({
            userId,
            status,
          }),
        );
        this.server.emit('get-status', userStatusArray);
      }
    }
  }

  @SubscribeMessage('newConnection')
  handleneConnection(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (userId) {
      if (!userSocketMap.has(userId)) {
        userSocketMap.set(userId, { status: 'online', sockets: [client.id] });
      } else {
        if (userSocketMap.get(userId).status === 'in-game') {
          userSocketMap.set(userId, {
            status: 'in-game',
            sockets: [...userSocketMap.get(userId).sockets, client.id],
          });
        } else {
          userSocketMap.set(userId, {
            status: 'online',
            sockets: [...userSocketMap.get(userId).sockets, client.id],
          });
        }
      }
      const userStatusArray = Array.from(userSocketMap.entries()).map(
        ([userId, { status }]) => ({
          userId,
          status,
        }),
      );
      this.server.emit('get-status', userStatusArray);
    }
  }

  @SubscribeMessage('in-game')
  inGame(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (userId) {
      let socket = [client.id]
      if (userSocketMap.has(userId)) {
        socket = [...userSocketMap.get(userId).sockets]
      }
      userSocketMap.set(userId, {
        status: 'in-game',
        sockets: socket,
      });
      const userStatusArray = Array.from(userSocketMap.entries()).map(
        ([userId, { status }]) => ({
          userId,
          status,
        }),
      );
      this.server.emit('get-status', userStatusArray);
    }
  }

  @SubscribeMessage('out-game')
  outGame(@MessageBody() userId: string, @ConnectedSocket() client: Socket) {
    if (userId) {
      if (userSocketMap.has(userId)) {
        userSocketMap.set(userId, {
          status: 'online',
          sockets: userSocketMap.get(userId).sockets,
        });
      }
      const userStatusArray = Array.from(userSocketMap.entries()).map(
        ([userId, { status }]) => ({
          userId,
          status,
        }),
      );
      this.server.emit('get-status', userStatusArray);
    }
  }

  @SubscribeMessage('checkStatus')
  checkStatus(@ConnectedSocket() client: Socket) {
    const userStatusArray = Array.from(userSocketMap.entries()).map(
      ([userId, { status }]) => ({
        userId,
        status,
      }),
    );
    client.emit('get-status', userStatusArray);
  }
}
