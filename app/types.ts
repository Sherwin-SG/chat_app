export interface Friend {
    _id: string;
    name?: string;
    email?: string;
  }
  
  export interface Message {
    _id: string;
    senderEmail: string;
    receiverEmail: string;
    recipientId: string;
    text: string;
    createdAt: string;
    content: string;
  }

  export interface ErrorState {
    message: string;
  }
  
