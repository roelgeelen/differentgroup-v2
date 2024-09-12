export interface IConversation {
  id?: string;
  title: string;
  body: string;
  managerComment?: string;
  comment?: string;
  createdAt?: string;
  createdBy?: string;
  isApproved: boolean;
  isRead: boolean;
  isPublished: boolean;
}
