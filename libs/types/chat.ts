export interface Message {
  messageID: string;
  senderName: string;
  senderID: string;
  receiverName: string;
  receiverID: string;
  content: string;
  createdAt: string;
  conversationID: string;
}

export interface Conversations {
  messageID: string;
  senderName: string;
  senderID: string;
  receiverName: string;
  receiverID: string;
  content: string;
  createdAt: string;
  conversationID: string;
}
