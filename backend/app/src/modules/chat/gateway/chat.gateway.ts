import { Logger } from '@nestjs/common';
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
import { ChatService } from '../services/chat.service';
import { MsgDto } from '../dto/msg.dto';
import { ConfigService } from '@nestjs/config';
enum event {
  CONNECT = 'connect',
  NEW_CONNECTION = 'newConnection',
  DISCONNECT = 'disconnect',
  LEAVE_ROOM = 'leave-room',
  SEND_MESSAGE = 'sendMessage',
  RECV_MESSAGE = 'recvMessage',
  CREATE_ROOM = 'createRoom',
  NEW_ROOM = 'newRoom',
  LAST_MESSAGE = 'lastMessage',
  JOIN_FRIEND_ROOM = 'joinFriendRoom',
  JOIN_NEW_ROOM = 'joinNewRoom',
  MAKE_ADMIN = 'make-admin',
  REMOVE_ADMIN = 'remove-admin',
  KICK_MEMBER = 'kick-member',
  UPDATE_ROOM = 'update-room',
  BAN_MEMBER = 'ban-member',
  BLOCK = 'block',
  DEBLOCK = 'deblock',
  USER_BLOCK_STATE = 'user-block-state',
  ADD_MEMBERS = 'add-members',
  MUTE_MEMBER = 'mute-member',
  UNMUTE_MEMBER = 'unmute-member',
}

const userChatSocketMap = new Map<string, Socket[]>();

const configService = new ConfigService();

interface roomMember {
  id: string;
  username: string;
}
@WebSocketGateway({
  namespace: '/chat/chat-socket',
  cors: {
    origin: configService.get('CORS_URL', 'http://localhost:3000'),
  },
  // namespace: '/chat',
})
export class MyGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  afterInit() {
    this.logger.log('Init');
  }
  handleConnection(client: Socket) {
    console.log(`Client 1 connected yo: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client 1 disconnected: ${client.id}`);
    userChatSocketMap.forEach((sockets) => {
      const index = sockets.findIndex((socket) => socket.id === client.id);
      if (index >= 0) {
        sockets.splice(index, 1);
      }
    });
  }

  @SubscribeMessage(event.NEW_CONNECTION)
  handleNewConnection(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    if (userId !== '') {
      this.chatService
        .findAllRoomsId(userId)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            client.join(res[i].id);
          }
        })
        .catch((err) => {
          console.log('error: ', err);
        });
      client.join(userId);
      if (!userChatSocketMap.has(userId)) {
        userChatSocketMap.set(userId, []);
      }
      userChatSocketMap.get(userId).push(client);
    }
  }
  @SubscribeMessage(event.CREATE_ROOM)
  handleCreateNewRoom(@MessageBody() room: { roomId: string; userId: string }) {
    if (userChatSocketMap.has(room.userId)) {
      userChatSocketMap.get(room.userId).forEach((socket) => {
        socket.join(room.roomId);
      });
    }
    this.server.to(room.userId).emit(event.NEW_ROOM);
  }
  @SubscribeMessage(event.JOIN_FRIEND_ROOM)
  handleJoinFriendRoom(
    @MessageBody() room: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(room.roomId);
  }

  @SubscribeMessage(event.JOIN_NEW_ROOM)
  handleJoinPublicRoom(
    @MessageBody() data: { roomId: string; userId: string; username: string },
  ) {
    if (userChatSocketMap.has(data.userId)) {
      userChatSocketMap.get(data.userId).forEach((socket) => {
        socket.join(data.roomId);
      });
      this.server.to(data.userId).emit(event.NEW_ROOM);
      this.chatService
        .newMsg({
          content: `${data.username} joined the room`,
          roomId: data.roomId,
          senderId: data.userId,
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          timeOnMilisecond: new Date().getTime().toString(),
          type: 'EVENT',
          senderPicture: '',
        })
        .then((res) => {
          this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
            content: `${data.username} joined the room`,
            roomId: data.roomId,
            senderId: data.userId,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
          });
        });
      this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
    }
  }
  @SubscribeMessage(event.LEAVE_ROOM)
  handleLeaveRoom(
    @MessageBody() data: { roomId: string; userId: string; username: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('leave room: ', data);
    this.chatService.kickMember(data.roomId, data.userId).then(() => {
      this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
      if (userChatSocketMap.has(data.userId)) {
        userChatSocketMap.get(data.userId).forEach((socket) => {
          socket.leave(data.roomId);
        });
      }
      this.chatService
        .newMsg({
          content: `${data.username} Leave the room`,
          roomId: data.roomId,
          senderId: data.userId,
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
          timeOnMilisecond: new Date().getTime().toString(),
          type: 'EVENT',
          senderPicture: '',
        })
        .then((res) => {
          this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
            content: `${data.username} Leave the room`,
            roomId: data.roomId,
            senderId: data.userId,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
          });
          this.server.to(data.userId).emit(event.NEW_ROOM);
        });
    });
    // client.leave(room.roomId);
  }

  @SubscribeMessage(event.SEND_MESSAGE)
  handleNewMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    message: {
      content: string;
      roomId: string;
      senderId: string;
      time: string;
      timeOnMilisecond: string;
      type: string;
    },
  ) {
    this.chatService
      .newMsg(message as MsgDto)
      .then(() => {
        client.broadcast.to(message.roomId).emit(event.RECV_MESSAGE, message);
        this.server.to(message.roomId).emit(event.LAST_MESSAGE, message);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  @SubscribeMessage(event.MAKE_ADMIN)
  handleMakeAdmin(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      by: string;
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService
      .makeAdmin(data.roomId, data.userId)
      .then((res) => {
        this.chatService
          .newMsg({
            content: `${data.by} made ${data.username} admin`,
            roomId: data.roomId,
            senderId: data.by,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
            senderPicture: '',
          })
          .then((res) => {
            this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
              content: `${data.by} made ${data.username} admin`,
              roomId: data.roomId,
              senderId: data.by,
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timeOnMilisecond: new Date().getTime().toString(),
              type: 'EVENT',
            });
          })
          .then(() => {
            this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
          });
      })
      .catch(() => {
        console.log('cant make this admin');
      });
  }
  @SubscribeMessage(event.REMOVE_ADMIN)
  handleRemoveAdmin(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      by: string;
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService
      .removeAdmin(data.roomId, data.userId)
      .then((res) => {
        this.chatService
          .newMsg({
            content: `${data.by} remove ${data.username} from admin list`,
            roomId: data.roomId,
            senderId: data.by,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
            senderPicture: '',
          })
          .then((res) => {
            this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
              content: `${data.by} remove ${data.username} from admin list`,
              roomId: data.roomId,
              senderId: data.by,
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timeOnMilisecond: new Date().getTime().toString(),
              type: 'EVENT',
            });
          })
          .then(() => {
            this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
          });
      })
      .catch(() => {
        console.log('cant remove this admin');
      });
  }

  @SubscribeMessage(event.KICK_MEMBER)
  handleKickMember(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      by: string;
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('kick: ', data);
    this.chatService
      .kickMember(data.roomId, data.userId)
      .then((res) => {
        this.chatService
          .newMsg({
            content: `${data.by} kick ${data.username} from the room`,
            roomId: data.roomId,
            senderId: data.by,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
            senderPicture: '',
          })
          .then((res) => {
            this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
              content: `${data.by} kick ${data.username} from the room`,
              roomId: data.roomId,
              senderId: data.by,
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timeOnMilisecond: new Date().getTime().toString(),
              type: 'EVENT',
            });
          })
          .then(() => {
            this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
            this.server.to(data.userId).emit(event.NEW_ROOM);
            if (userChatSocketMap.has(data.userId)) {
              userChatSocketMap.get(data.userId).forEach((socket) => {
                socket.leave(data.roomId);
              });
            }
          });
      })
      .catch(() => {
        console.log('cant remove this member');
      });
  }

  @SubscribeMessage(event.BAN_MEMBER)
  handleBanMember(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      by: string;
      username: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService
      .banMember(data.roomId, data.userId)
      .then((res) => {
        this.chatService
          .newMsg({
            content: `${data.by} ban ${data.username} from the room`,
            roomId: data.roomId,
            senderId: data.by,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
            senderPicture: '',
          })
          .then((res) => {
            this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
              content: `${data.by} ban ${data.username} from the room`,
              roomId: data.roomId,
              senderId: data.by,
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timeOnMilisecond: new Date().getTime().toString(),
              type: 'EVENT',
            });
          })
          .then(() => {
            this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
            this.server.to(data.userId).emit(event.NEW_ROOM);
            if (userChatSocketMap.has(data.userId)) {
              userChatSocketMap.get(data.userId).forEach((socket) => {
                socket.leave(data.roomId);
              });
            }
          });
      })
      .catch(() => {
        console.log('cant ban this member');
      });
  }
  @SubscribeMessage(event.MUTE_MEMBER)
  handleMuteMember(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
      by: string;
      username: string;
      period: string;
      createat: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('data: ', data);
    this.chatService
      .muteMember(data.roomId, data.userId, data.createat, data.period)
      .then((res) => {
        if (res !== undefined) {
          this.chatService
            .newMsg({
              content: `${data.by} mute ${data.username} from the room for ${
                Number(data.period) / 60
              } min`,
              roomId: data.roomId,
              senderId: data.by,
              time: new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              }),
              timeOnMilisecond: new Date().getTime().toString(),
              type: 'EVENT',
              senderPicture: '',
            })
            .then((res) => {
              this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
                content: `${data.by} mute ${data.username} from the room for ${
                  Number(data.period) / 60
                } min`,
                roomId: data.roomId,
                senderId: data.by,
                time: new Date().toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
                  hour12: true,
                }),
                timeOnMilisecond: new Date().getTime().toString(),
                type: 'EVENT',
              });
              this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
            });
        }
      })
      .catch(() => {
        console.log('cant mute this member');
      });
  }
  @SubscribeMessage(event.UNMUTE_MEMBER)
  handleUnmuteMember(
    @MessageBody()
    data: {
      roomId: string;
      userId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService
      .unmuteMember(data.userId, data.roomId)
      .then((res) => {
        console.log('unmute: ', res);
      })
      .catch(() => {
        console.log('cant unmute this member');
      });
  }

  @SubscribeMessage(event.BLOCK)
  handleBlock(
    @MessageBody()
    data: {
      userId: string;
      friendId: string;
      roomId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.blockFriend(data.userId, data.friendId);
    this.server
      .to(data.roomId)
      .emit(event.USER_BLOCK_STATE, { ...data, block: true });
  }

  @SubscribeMessage(event.DEBLOCK)
  handleDeblock(
    @MessageBody()
    data: {
      userId: string;
      friendId: string;
      roomId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('deblock: ', data);
    this.chatService.deblockFriend(data.userId, data.friendId);
    this.server
      .to(data.roomId)
      .emit(event.USER_BLOCK_STATE, { ...data, block: false });
  }

  @SubscribeMessage(event.ADD_MEMBERS)
  handleAddMembers(
    @MessageBody()
    data: {
      roomId: string;
      username: string;
      members: roomMember[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService
      .addMembers(data.roomId, data.members)
      .then(async () => {
        await data.members.forEach((member) => {
          if (userChatSocketMap.has(member.id)) {
            userChatSocketMap.get(member.id).forEach((socket) => {
              socket.join(data.roomId);
              this.server.to(member.id).emit(event.NEW_ROOM);
            });
          }
        });

        data.members.forEach((member) => {
          this.chatService.newMsg({
            content: `${data.username} add ${member.username} to the room`,
            roomId: data.roomId,
            senderId: data.username,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
            senderPicture: '',
          });
          this.server.to(data.roomId).emit(event.RECV_MESSAGE, {
            content: `${data.username} add ${member.username} to the room`,
            roomId: data.roomId,
            senderId: data.username,
            time: new Date().toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            }),
            timeOnMilisecond: new Date().getTime().toString(),
            type: 'EVENT',
          });
        });
        this.server.to(data.roomId).emit(event.UPDATE_ROOM, data);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
