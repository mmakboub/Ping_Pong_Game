import { Msg } from "./msg.dto";
import { User } from "./user.dto";
export interface Room {
  id: string;
  name: string;
  type: string;
  pictureUrl: string;
  member: User[];
  admin: User[];
  baned: User[];
  owner: User;
  ownerId: string;
  password: string;
  msgs: Msg[];
}
