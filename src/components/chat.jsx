import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const sanitizeMessageContent = (content) => {
  const tempElement = document.createElement('div');
  tempElement.innerText = content;
  return tempElement.innerHTML;
};

const getBotResponse = (message) => {
  const botReplies = [
    "Hej! Hur kan jag hjälpa dig?",
    "Det låter intressant, berätta mer!",
    "Tack för att du delar med dig.",
    "Jag är här för att lyssna!",
    "Vad tycker du om det här ämnet?",
  ];
  return botReplies[Math.floor(Math.random() * botReplies.length)];
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [currentConversation, setCurrentConversation] = useState('mockConversationId');
  const [token, setToken] = useState('mockToken');
  const navigate = useNavigate();

 
  const currentUserId = 'mockUserId';


  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const mockMessages = [
      { id: 1, userId: 'mockUserId', content: 'Hej, hur mår du?' },
      { id: 2, userId: 'bot', content: 'Hej! Hur kan jag hjälpa dig?' },
    ];
    setMessages(mockMessages);
  }, [currentConversation]);

  const handleNewMessage = async (e) => {
    e.preventDefault();
    setError('');

    if (!newMessage.trim()) {
      setError('Meddelandet kan inte vara tomt.');
      return;
    }

    const sanitizedMessage = sanitizeMessageContent(newMessage.trim());

    const newUserMessage = {
      id: messages.length + 1,
      userId: currentUserId,
      content: sanitizedMessage,
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setNewMessage('');

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        userId: 'bot',
        content: sanitizeMessageContent(getBotResponse(newMessage)),
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 1000);
  };


  const handleDeleteMessage = (msgId) => {
    const updatedMessages = messages.filter((message) => message.id !== msgId);
    setMessages(updatedMessages);
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      {error && <div className="error-bubble">{error}</div>}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === currentUserId ? 'right' : 'left'}`}
          >
            <p dangerouslySetInnerHTML={{ __html: sanitizeMessageContent(message.content) }}></p>
            {message.userId === currentUserId && (
              <button onClick={() => handleDeleteMessage(message.id)}>Radera</button>
            )}
          </div>
        ))}
      </div>

   
      <form onSubmit={handleNewMessage}>
        <input
          type="text"
          name="messageInput"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande"
        />
        <button type="submit">Skicka</button>
      </form>
    </div>
  );
};

export default Chat;
