import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect, useState, ChangeEvent } from 'react';
import io from 'socket.io-client';
import MessageList from '../../components/MessageList';
import MessageInput from '../../components/MessageInput';

const socket = io('http://localhost:3000'); 

interface Message {
  content: string;
  senderEmail: string;
  receiverEmail: string;
  createdAt: string;
}

const ChatPage = () => {
  const router = useRouter();
  const { friendId } = router.query;
  const { data: session } = useSession();
  const userEmail = session?.user?.email;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (userEmail && friendId) {
      // Fetch messages
      const fetchMessages = async () => {
        try {
          const response = await fetch(`/api/messages/${userEmail}/${friendId}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();
    }
  }, [userEmail, friendId]);

  useEffect(() => {
    // Listen for new messages
    socket.on('receiveMessage', (message: Message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userEmail, friendId]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      content: newMessage,
      senderEmail: userEmail!,
      receiverEmail: friendId as string,
      createdAt: new Date().toISOString(),
    };

    // Send message to the server
    socket.emit('sendMessage', message);

    // Update messages state
    setMessages(prevMessages => [...prevMessages, message]);

    // Clear input
    setNewMessage('');
  };

  if (!userEmail || !friendId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chat with {friendId}</h1>
      <MessageList messages={messages} currentUserEmail={userEmail}/>
      <MessageInput 
        value={newMessage} 
        onChange={handleChange} 
        onSend={handleSendMessage} 
      />
    </div>
  );
};

export default ChatPage;
