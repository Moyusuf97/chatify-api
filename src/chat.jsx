import { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get('https://chatify-api.up.railway.app/messages', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessages(response.data);
    };
    fetchMessages();
  }, []);

  const handleNewMessage = async (e) => {
    e.preventDefault();
    await axios.post(
      'https://chatify-api.up.railway.app/messages',
      { content: newMessage },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    setNewMessage(''); // Töm meddelandet
  };

  return (
    <div>
      <h2>Chat</h2>
      <div>
        {messages.map((message) => (
          <div key={message.id} className={message.userId === user.id ? 'right' : 'left'}>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleNewMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
