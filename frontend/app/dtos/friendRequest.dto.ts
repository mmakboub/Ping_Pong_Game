export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
}

interface SenderData {
  username: string;
  pictureUrl: string;
}
export interface FriendResponse {
  status: string;
  sender: SenderData;
  senderId: string;
}
