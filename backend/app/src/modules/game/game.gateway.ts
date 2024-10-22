import { ConsoleLogger, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.sevice';

@WebSocketGateway()
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private logger: Logger = new Logger('GameGateway');

  constructor(private configService: ConfigService, private readonly gameService: GameService) { }

  afterInit(server: Server) {
    const websocketPort = this.configService.get<number>(
      'WEBSOCKET_PORT',
      4001,
    );
    const corsUrl = this.configService.get<string>(
      'CORS_URL',
      'http://localhost:3000',
    );
    // Apply dynamic settings to the server
    server.listen(websocketPort, {
      cors: {
        origin: corsUrl,
      },
    });

    this.logger.log(
      `Initialized on port ${websocketPort} with CORS origin: ${corsUrl}`,
    );
  }

  private canvasHeight = 400;
  private canvasWidth = 600;

  private rooms = [];
  private client: Socket;

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    this.client = client;
  }

  handleDisconnect(client: Socket) {
    let data = this.findRoomIdAndPlayerBySocketId(client.id);
    if (data == null)
      data = this.findRoomIdAndPlayerBySocketIdPrivate(client.id);
    //for the cancel
    if (data && data.player.inGame == false) {
      let room = this.rooms.find((room) => room.id === data.roomId);
      this.server.to(data.roomId).emit('matchCancel', data.player.playerNo, room);
      console.log("player", data.player.playerNo, data.player.username, "canceled room", data.roomId);
      client.leave(data.roomId);
      if (room.players.length == 2 && data.player.playerNo == 1) {
        room.players[0] = room.players[1];
        room.players[0].playerNo = 1;
        room.players[0].x = 0;
        room.players[0].y = this.canvasHeight / 2 - 100 / 2;
        room.players[0].width = 10;
        room.players[0].height = 100;
        room.players[0].acceptMatch = false;
        room.players.pop();
      } else {
        room.players.pop();
      }
      if (room.players.length == 0) {
        this.rooms = this.rooms.filter((room) => room.id != data.roomId);
      }
    }
    //for the exit
    else if (data && data.player.inGame == true) {
      
      let room = this.rooms.find((room) => room.id === data.roomId);
      if (room) {
        room.players[data.player.playerNo - 1].inGame = false;
        // update rooms
        this.rooms = this.rooms.map((r) => {
          if (r.id === room.id) return room;
          else return r;
        });
        console.log("player", data.player.playerNo, room.players[data.player.playerNo - 1].username, "exited room", data.roomId);
        this.server.to(room.id).emit('updateGame', room);
      }
      room = this.roomsPrivate.find((room) => room.id === data.roomId);
      if (room) {
        room.players[data.player.playerNo - 1].inGame = false;
        // update rooms
        this.roomsPrivate = this.roomsPrivate.map((r) => {
          if (r.id === room.id) return room;
          else return r;
        });
        console.log("player", data.player.playerNo, room.players[data.player.playerNo - 1].username, "exited room", data.roomId);
        console.log(room);
        this.server.to(room.id).emit('updateGame', room);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('checkIfInGame')
  onCheckIfInGameMessage(client: Socket) {
    const data = this.findRoomIdAndPlayerBySocketId(client.id);
    const dataPrivate = this.findRoomIdAndPlayerBySocketIdPrivate(client.id);

    if (data || dataPrivate)
      this.server.to(client.id).emit('checkIfInGameResponse', true);
    else
      this.server.to(client.id).emit('checkIfInGameResponse', false);

  }

  @SubscribeMessage('leave')
  onLeaveMessage(client: Socket, room: any) {
    client.leave(room.id);
  }

  @SubscribeMessage('cancel')
  onCancelMessage(client: Socket, data: any) {
    let room = this.rooms.find((room) => room.id === data.roomID);
    this.server.to(data.roomID).emit('matchCancel', data.playerNo, room);
    console.log("player", data.playerNo, data.playerUsername, "canceled room", data.roomID);

    client.leave(data.roomID);
    if (room) {
      if (room.players.length == 2 && data.playerNo == 1) {
        room.players[0] = room.players[1];
        room.players[0].playerNo = 1;
        room.players[0].x = 0;
        room.players[0].y = this.canvasHeight / 2 - 100 / 2;
        room.players[0].width = 10;
        room.players[0].height = 100;
        room.players[0].acceptMatch = false;
        room.players.pop();
  
      } else {
        room.players.pop();
      }
      if (room.players.length == 0) {
        this.rooms = this.rooms.filter((room) => room.id != data.roomID);
      }
    }
  }
  @SubscribeMessage('move')
  onMoveMessage(@MessageBody() data: { roomId: number; playerNo: number; newY: number }) {
    let room = this.rooms.find((room) => room.id === data.roomId);
    if (room) {
      room.players[data.playerNo - 1].y = data.newY;

      // update rooms
      this.rooms = this.rooms.map((r) => {
        if (r.id === room.id) return room;
        else return r;
      });
      this.server.to(room.id).emit('updateGame', room);
    }
    room = this.roomsPrivate.find((room) => room.id === data.roomId);
    if (room) {
      room.players[data.playerNo - 1].y = data.newY;

      // update rooms
      this.roomsPrivate = this.roomsPrivate.map((r) => {
        if (r.id === room.id) return room;
        else return r;
      });
      this.server.to(room.id).emit('updateGame', room);
    }
  }

  @SubscribeMessage('exit')
  onExitMessage(@MessageBody() data: { roomId: number; playerNo: number }) {
    let room = this.rooms.find((room) => room.id === data.roomId);
    if (room) {
      room.players[data.playerNo - 1].inGame = false;
      // update rooms
      this.rooms = this.rooms.map((r) => {
        if (r.id === room.id) return room;
        else return r;
      });
      console.log("player", data.playerNo, room.players[data.playerNo - 1].username, "exited room", data.roomId);
      this.server.to(room.id).emit('updateGame', room);
    }
    room = this.roomsPrivate.find((room) => room.id === data.roomId);
    if (room) {
      room.players[data.playerNo - 1].inGame = false;
      // update rooms
      this.roomsPrivate = this.roomsPrivate.map((r) => {
        if (r.id === room.id) return room;
        else return r;
      });
      console.log("player", data.playerNo, room.players[data.playerNo - 1].username, "exited room", data.roomId);
      this.server.to(room.id).emit('updateGame', room);
    }
  }

  private room: any;
  @SubscribeMessage('accept')
  onAcceptMessage(
    @MessageBody() data: { client: Socket; roomID: number; playerNo: number },
  ) {
    let room = this.rooms.find((room) => room.id === data.roomID);
    if (data.playerNo == 1) {
      room.players[0].acceptMatch = true;
    }
    if (data.playerNo == 2) {
      room.players[1].acceptMatch = true;
    }
    if (room.players.length == 2) {
      if (room.players[0].acceptMatch && room.players[1].acceptMatch) {
        room.players[0].acceptMatch = false;
        room.players[1].acceptMatch = false;

        this.server.to(room.id).emit('bothAccepted', room.id);

        setTimeout(() => {
          this.server.to(room.players[0].socketId).emit('playerNo', 1);
          this.server.to(room.players[1].socketId).emit('playerNo', 2);
          this.server.to(room.id).emit('roomid', room.id);
          room.players[0].inGame = true;
          room.players[1].inGame = true;
          this.server.to(room.id).emit('startingGame', room);
        }, 1000);

        setTimeout(() => {
          this.server.to(room.id).emit('startedGame', room);
          // start game
          this.startGame(room, data.client);
        }, 5000);
      }
    }
  }

  findPlayerByUsername(usernameToFind: string) {
    for (const room of this.rooms) {
      for (const player of room.players) {
        if (player.username === usernameToFind) {
          return player;
        }
      }
    }
    return null;
  }

  findRoomIdAndPlayerBySocketId(socketIdToFind: string) {
    for (const room of this.rooms) {
      for (const player of room.players) {
        if (player.socketId === socketIdToFind) {
          return {
            roomId: room.id,
            player: player,
          };
        }
      }
    }
    return null;
  }

  findRoomIdAndPlayerBySocketIdPrivate(socketIdToFind: string) {
    for (const room of this.roomsPrivate) {
      for (const player of room.players) {
        if (player.socketId === socketIdToFind) {
          return {
            roomId: room.id,
            player: player,
          };
        }
      }
    }
    return null;
  }


  private player: any;
  @SubscribeMessage('join')
  onJoinMessage(client: Socket, userInfo: any) {
    console.log("received join");

    if (this.findPlayerByUsername(userInfo.username) == null
        && this.findPlayerByUsernameInvit(userInfo.username) == null) {

      if (this.rooms.length > 0 && this.rooms[this.rooms.length - 1].players.length === 1) {
        this.room = this.rooms[this.rooms.length - 1];
      }

      if (this.room && this.room.players.length === 1) {
        client.join(this.room.id);
        this.server.to(this.room.id).emit('roomId', this.room);
        const playerInfo = {
          playerNo: 2,
          username: userInfo.username,
          picture: userInfo.picture,
        }
        client.emit('playerInfo', playerInfo);
        const obj = {
          playerInfo: playerInfo,
          roomId: this.room.id
        }
        client.emit('playerInfoAndRoomId', obj);

        // add player to room
        this.room.players.push({
          socketId: client.id,
          acceptMatch: false,
          inGame: false,
          username: userInfo.username,
          picture: userInfo.picture,
          playerNo: 2,
          x: this.canvasWidth - 10,
          y: this.canvasHeight / 2 - 100 / 2,
          width: 10,
          height: 100,
          score: 0,
        });
        console.log("player 2", userInfo.username, "joined room", this.room.id);
        this.server.to(this.room.id).emit('matchUp', this.room);
      } else {
        this.room = {
          id: this.rooms.length + 1,
          players: [
            {
              socketId: client.id,
              acceptMatch: false,
              inGame: false,
              username: userInfo.username,
              picture: userInfo.picture,
              playerNo: 1,
              x: 0,
              y: this.canvasHeight / 2 - 100 / 2,
              width: 10,
              height: 100,
              score: 0,
            },
          ],
          ball: {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            dx: Math.random() < 0.5 ? 1 : -1,
            dy: 0,
          },
          winner: 0,
        };
        this.rooms.push(this.room);
        client.join(this.room.id);
        this.server.to(this.room.id).emit('roomId', this.room);
        const playerInfo = {
          playerNo: 1,
          username: userInfo.username,
          picture: userInfo.picture,
        }
        console.log("player 1", userInfo.username, "joined room", this.room.id);
        client.emit('playerInfo', playerInfo);
        const obj = {
          playerInfo: playerInfo,
          roomId: this.room.id
        }
        client.emit('playerInfoAndRoomId', obj);
      }
    }
  }

  startGame(room: any, client: Socket) {
    console.log("game started")
    let interval = setInterval(() => {
      room.ball.x += room.ball.dx * 5;
      room.ball.y += room.ball.dy * 5;

      // check if ball hits player 1
      if (
        room.ball.x < 20 &&
        room.ball.y > room.players[0].y &&
        room.ball.y < room.players[0].y + 100
      ) {
        room.ball.dx = 1;

        // change ball direction
        if (room.ball.y < room.players[0].y + 50) {
          room.ball.dy = -1;
        } else if (room.ball.y > room.players[0].y + 50) {
          room.ball.dy = 1;
        } else {
          room.ball.dy = 0;
        }
      }

      // check if ball hits player 2
      if (
        room.ball.x > this.canvasWidth - 20 &&
        room.ball.y > room.players[1].y &&
        room.ball.y < room.players[1].y + 100
      ) {
        room.ball.dx = -1;

        // change ball direction
        if (room.ball.y < room.players[1].y + 50) {
          room.ball.dy = -1;
        } else if (room.ball.y > room.players[1].y + 50) {
          room.ball.dy = 1;
        } else {
          room.ball.dy = 0;
        }
      }

      // up and down walls
      if (room.ball.y < 5 || room.ball.y > this.canvasHeight - 5) {
        room.ball.dy *= -1;
      }

      // left and right walls
      if (room.ball.x < 5) {
        room.players[1].score += 1;
        (room.ball.x = this.canvasWidth / 2),
          (room.ball.y = this.canvasHeight / 2),
          (room.ball.dx = 1);
        room.ball.dy = 0;
      }

      if (room.ball.x > this.canvasWidth - 5) {
        room.players[0].score += 1;
        (room.ball.x = this.canvasWidth / 2),
          (room.ball.y = this.canvasHeight / 2),
          (room.ball.dx = -1);
        room.ball.dy = 0;
      }

      if (room.players[0].score === 5) {
        room.winner = 1;
        this.gameService.save({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: room.players[0].score,
          loseScore: room.players[1].score
        })
        this.gameService.updateStats({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: room.players[0].score,
          loseScore: room.players[1].score
        })
        this.rooms = this.rooms.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[1].score === 5) {
        room.winner = 2;
        this.gameService.save({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: room.players[1].score,
          loseScore: room.players[0].score
        });
        this.gameService.updateStats({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: room.players[1].score,
          loseScore: room.players[0].score
        });
        this.rooms = this.rooms.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[0].inGame == false) {
        room.winner = 2;
        this.gameService.save({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: 5,
          loseScore: 0
        });
        this.gameService.updateStats({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: 5,
          loseScore: 0
        });
        this.rooms = this.rooms.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[1].inGame == false) {
        room.winner = 1;
        this.gameService.save({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: 5,
          loseScore: 0
        });
        this.gameService.updateStats({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: 5,
          loseScore: 0
        });
        this.rooms = this.rooms.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      this.server.to(room.id).emit('updateGame', room);
    }, 1000 / 60);
  }

  findPlayerByUsernameInvit(usernameToFind: string) {
    for (const room of this.roomsPrivate) {
      for (const player of room.players) {
        if (player.username === usernameToFind) {
          return player;
        }
      }
    }
    return null;
  }

  private roomsPrivate = [];

  @SubscribeMessage('joinInvit')
  onJoinInvitMessage(client: Socket, userInfo: any) {

    if (this.findPlayerByUsername(userInfo.username) == null 
    && this.findPlayerByUsernameInvit(userInfo.username) == null) {

      if (userInfo.type == "guest" || this.roomsPrivate.find((room) => room.chatRoom === userInfo.roomId)) {

        this.room = this.roomsPrivate.find((room) => room.chatRoom === userInfo.roomId);

        if (this.room != null) {
  
          if (this.room && this.room.players.length === 1) {
            client.join(this.room.id);
            this.server.to(this.room.id).emit('roomId', this.room);
            const playerInfo = {
              playerNo: 2,
              username: userInfo.username,
              picture: userInfo.picture,
            }
            client.emit('playerInfo', playerInfo);
            const obj = {
              playerInfo: playerInfo,
              roomId: this.room.id
            }
            client.emit('playerInfoAndRoomId', obj);
  
            // add player to room
            this.room.players.push({
              socketId: client.id,
              acceptMatch: false,
              inGame: false,
              username: userInfo.username,
              picture: userInfo.picture,
              playerNo: 2,
              x: this.canvasWidth - 10,
              y: this.canvasHeight / 2 - 100 / 2,
              width: 10,
              height: 100,
              score: 0,
            });
            this.room.players[1].acceptMatch = true;
            console.log("player 2", userInfo.username, "joined room", this.room.id);
            this.server.to(this.room.id).emit('matchUp', this.room);
            if (this.room.players.length == 2) {
              if (this.room.players[0].acceptMatch && this.room.players[1].acceptMatch) {
                this.room.players[0].acceptMatch = false;
                this.room.players[1].acceptMatch = false;
        
                this.server.to(this.room.id).emit('roomdId', this.room);
                this.server.to(this.room.id).emit('bothAccepted', this.room.id);
        
                setTimeout(() => {
                  this.server.to(this.room.players[0].socketId).emit('playerNo', 1);
                  this.server.to(this.room.players[1].socketId).emit('playerNo', 2);
                  this.server.to(this.room.id).emit('this.roomid', this.room.id);
                  this.room.players[0].inGame = true;
                  this.room.players[1].inGame = true;
                  this.server.to(this.room.id).emit('startingGame', this.room);
                }, 1000);
        
                setTimeout(() => {
                  this.server.to(this.room.id).emit('startedGame', this.room);
                  // start game
                  this.startGamePrivate(this.room, client);
                }, 5000);
              }
            }
          }
        }
      }
      else if (userInfo.type == "owner") {
        this.room = {
          id: this.roomsPrivate.length + 1,
          chatRoom: userInfo.roomId,
          players: [
            {
              socketId: client.id,
              acceptMatch: false,
              inGame: false,
              username: userInfo.username,
              picture: userInfo.picture,
              playerNo: 1,
              x: 0,
              y: this.canvasHeight / 2 - 100 / 2,
              width: 10,
              height: 100,
              score: 0,
            },
          ],
          ball: {
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            dx: Math.random() < 0.5 ? 1 : -1,
            dy: 0,
          },
          winner: 0,
        };
        this.roomsPrivate.push(this.room);
        this.room.players[0].acceptMatch = true;
        client.join(this.room.id);
        this.server.to(this.room.id).emit('roomId', this.room);
        const playerInfo = {
          playerNo: 1,
          username: userInfo.username,
          picture: userInfo.picture,
        }
        console.log("player 1", userInfo.username, "joined room", this.room.id);
        client.emit('playerInfo', playerInfo);
        const obj = {
          playerInfo: playerInfo,
          roomId: this.room.id
        }
        client.emit('playerInfoAndRoomId', obj);
      }
    }
    else if ( this.findPlayerByUsernameInvit(userInfo.username) != null) {
      this.room = this.roomsPrivate.find((room) => room.chatRoom === userInfo.roomId);
      if (this.room) {
        this.server.to(this.room.id).emit('roomId', this.room);
        const playerInfo = {
          playerNo: 1,
          username: userInfo.username,
          picture: userInfo.picture,
        }
        console.log("player 1", userInfo.username, "joined room", this.room.id);
        client.emit('playerInfo', playerInfo);
        const obj = {
          playerInfo: playerInfo,
          roomId: this.room.id
        }
        client.emit('playerInfoAndRoomId', obj);
      }
    }
  }

  startGamePrivate(room: any, client: Socket) {
    console.log("private game started")
    let interval = setInterval(() => {
      room.ball.x += room.ball.dx * 5;
      room.ball.y += room.ball.dy * 5;

      // check if ball hits player 1
      if (
        room.ball.x < 20 &&
        room.ball.y > room.players[0].y &&
        room.ball.y < room.players[0].y + 100
      ) {
        room.ball.dx = 1;

        // change ball direction
        if (room.ball.y < room.players[0].y + 50) {
          room.ball.dy = -1;
        } else if (room.ball.y > room.players[0].y + 50) {
          room.ball.dy = 1;
        } else {
          room.ball.dy = 0;
        }
      }

      // check if ball hits player 2
      if (
        room.ball.x > this.canvasWidth - 20 &&
        room.ball.y > room.players[1].y &&
        room.ball.y < room.players[1].y + 100
      ) {
        room.ball.dx = -1;

        // change ball direction
        if (room.ball.y < room.players[1].y + 50) {
          room.ball.dy = -1;
        } else if (room.ball.y > room.players[1].y + 50) {
          room.ball.dy = 1;
        } else {
          room.ball.dy = 0;
        }
      }

      // up and down walls
      if (room.ball.y < 5 || room.ball.y > this.canvasHeight - 5) {
        room.ball.dy *= -1;
      }

      // left and right walls
      if (room.ball.x < 5) {
        room.players[1].score += 1;
        (room.ball.x = this.canvasWidth / 2),
          (room.ball.y = this.canvasHeight / 2),
          (room.ball.dx = 1);
        room.ball.dy = 0;
      }

      if (room.ball.x > this.canvasWidth - 5) {
        room.players[0].score += 1;
        (room.ball.x = this.canvasWidth / 2),
          (room.ball.y = this.canvasHeight / 2),
          (room.ball.dx = -1);
        room.ball.dy = 0;
      }

      if (room.players[0].score === 5) {
        room.winner = 1;
        this.gameService.save({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: room.players[0].score,
          loseScore: room.players[1].score
        })
        this.gameService.updateStats({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: room.players[0].score,
          loseScore: room.players[1].score
        })
        this.roomsPrivate = this.roomsPrivate.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[1].score === 5) {
        room.winner = 2;
        this.gameService.save({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: room.players[1].score,
          loseScore: room.players[0].score
        });
        this.gameService.updateStats({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: room.players[1].score,
          loseScore: room.players[0].score
        });
        this.roomsPrivate = this.roomsPrivate.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[0].inGame == false) {
        room.winner = 2;
        this.gameService.save({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: 5,
          loseScore: 0
        });
        this.gameService.updateStats({
          usernameWin: room.players[1].username,
          usernameLose: room.players[0].username,
          winScore: 5,
          loseScore: 0
        });
        this.roomsPrivate = this.roomsPrivate.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      if (room.players[1].inGame == false) {
        room.winner = 1;
        this.gameService.save({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: 5,
          loseScore: 0
        });
        this.gameService.updateStats({
          usernameWin: room.players[0].username,
          usernameLose: room.players[1].username,
          winScore: 5,
          loseScore: 0
        });
        this.roomsPrivate = this.roomsPrivate.filter((r) => r.id != room.id);
        this.server.to(room.id).emit('endGame', room);
        clearInterval(interval);
      }

      this.server.to(room.id).emit('updateGame', room);
    }, 1000 / 60);
  }

  @SubscribeMessage('cancelPrivate')
  onCancelPrivateMessage(client: Socket, data: any) {
    console.log("received cancelPrivate");
    let room = this.roomsPrivate.find((room) => room.chatRoom === data.roomID);
    if (room && room.players.length == 1)
    {
      console.log("player", data.playerUsername, "canceled room", data.roomID);

      client.leave(room.id);
      room.players.pop();
      if (room.players.length == 0) {
        this.roomsPrivate = this.roomsPrivate.filter((room) => room.chatRoom != data.roomID);
      }

    }
  }

}

