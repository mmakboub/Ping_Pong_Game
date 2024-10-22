export interface Room {
  type: string;
  name: string;
  password: string;
}

export class RoomDto implements Room {
  type: string;
  name: string;
  password: string;
}
