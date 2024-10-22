export interface Msg {
  time: string;
  content: string;
  timeOnMilisecond: string;
  senderId: string;
  roomId: string;
  type: string;
  senderPicture: string;
}

export class MsgDto implements Msg {
  senderId: string;
  content: string;
  time: string;
  timeOnMilisecond: string;
  roomId: string;
  type: string;
  senderPicture: string;
}
