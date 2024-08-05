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
    groupId: string;
  }
 
export interface Group {
  _id: string;
  name: string;
  members: string[];
}


  export interface ErrorState {
    message: string;
  }
  
