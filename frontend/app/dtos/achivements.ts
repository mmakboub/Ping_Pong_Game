import { User } from "./user.dto";
enum AchievementType {
  LONGEVITY,
  STRATEGIC,
  PRODIGY,
  GOLDEN,
  COMEBACK,
  RALLY,
  MASTER,
  CHALLENGER,
}
export interface Achievement {
  id: number;
  type: AchievementType;
  done: boolean;
  doneBy: User[];
}
