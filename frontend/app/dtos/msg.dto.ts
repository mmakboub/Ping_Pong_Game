export interface Msg {
  time: string;
  content: string;
  timeOnMilisecond: string;
  senderId: string;
  roomId: string;
  type: string;
  senderPicture: string;
  gameRoomI?: number;
  playerNumber?: number;
}
