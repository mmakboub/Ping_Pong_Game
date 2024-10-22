import { User } from "./user.dto";

export interface History {
  id: string;
  loseScore: number;
  winScore: number;
  usernameLose: String;
  usernameWin: String;
  date: string;
  playerLose: User,
  playerWin: User
}
