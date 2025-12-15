export interface Notification {
  _id: string;
  user: string;
  type: "post_deleted" | "new_comment" | "new_like" | string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  sender?: string;
}
