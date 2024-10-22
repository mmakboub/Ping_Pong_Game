import { Achievement } from "./achivements";

export interface User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  pictureUrl: string;
  matchLost: number;
  matchPlayed: number;
  matchWon: number;
  level: number;
  rank: number;
  isOnline: string;
  xp: number;
  friends: User[];
  twoFactor: boolean;
  isfirsttime: boolean;
  achievements: Achievement[];
}
