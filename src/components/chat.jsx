import React, { useState, useEffect } from 'react';
import Sidebar from './sidenav'; 


const sanitizeMessageContent = (input) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  return doc.body.innerText; 
};

const Chat = ({ token }) => {
  const [chatMessages, setChatMessages] = useState(JSON.parse(localStorage.getItem('chatMessages')) || []);
  const [inputMessage, setInputMessage] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [currentConversation, setCurrentConversation] = useState(localStorage.getItem('currentConversationId') || '');
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUsername') || '');
  const [currentUserId] = useState(localStorage.getItem('currentUserId') || '');
  const [allConversations, setAllConversations] = useState(JSON.parse(localStorage.getItem('allConversations')) || []);

  const fakeResponses = [
    "Det här är ett automatiskt svar!",
    "Intressant fråga, berätta mer!",
    "Jag håller med!",
  ];

  const getRandomResponse = () => {
    return fakeResponses[Math.floor(Math.random() * fakeResponses.length)];
  };

  useEffect(() => {
    if (!currentConversation) return;

    const loadMessages = async () => {
      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${currentConversation}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Kunde inte hämta meddelanden');

        const fetchedMessages = await response.json();
        setChatMessages(fetchedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(fetchedMessages));

        const isConversationExist = allConversations.some((conversation) => conversation.id === currentConversation);
        if (!isConversationExist) {
          const newConversation = {
            id: currentConversation,
            name: 'Ny konversation',
          };
          const updatedConversations = [...allConversations, newConversation];
          setAllConversations(updatedConversations);
          localStorage.setItem('allConversations', JSON.stringify(updatedConversations));
        }
      } catch (error) {
        setFetchError('Kunde inte hämta meddelanden');
      }
    };

    loadMessages();
  }, [currentConversation, token, allConversations]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sanitizeMessageContent(inputMessage),
          conversationId: currentConversation,
        }),
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte skickas');

      const { latestMessage } = await response.json();
      setChatMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, { ...latestMessage, userId: currentUserId, username: currentUser }];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });

      setInputMessage('');

      setTimeout(() => {
        const fakeResponse = {
          id: Math.random().toString(36).substr(2, 9),
          text: getRandomResponse(),
          conversationId: currentConversation,
          userId: 'bot123',
          username: 'ChatBot',
          avatar: 'https://i.pravatar.cc/100?u=bot123',
        };

        setChatMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, fakeResponse];
          localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
          return updatedMessages;
        });
      }, 2000);

    } catch (error) {
      setFetchError('Meddelandet kunde inte skickas');
    }
  };

  const removeMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Meddelandet kunde inte raderas');

      setChatMessages((previousMessages) => {
        const updatedMessages = previousMessages.filter((message) => message.id !== messageId);
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      setFetchError('Meddelandet kunde inte raderas');
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation.id);
    localStorage.setItem('currentConversationId', conversation.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="chat-container bg-white rounded-lg shadow-lg max-w-md w-full">
        <Sidebar onLogin={() => setCurrentUser(currentUser)} /> {/* Passera in onLogin callback */}
        <div className="chat-header p-4 border-b">
          <h2 className="chat-title text-lg font-bold text-gray-800">
            Chatt: {allConversations.find((convo) => convo.id === currentConversation)?.name || ''}
          </h2>
        </div>
        <div className="chat-messages p-4 overflow-y-auto max-h-96">
          <div className="message-list">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`message-bubble ${message.userId?.toString() === currentUserId?.toString() ? 'sent' : 'received'}`}
                style={{
                  display: 'flex',
                  justifyContent: message.userId?.toString() === currentUserId?.toString() ? 'flex-end' : 'flex-start',
                  marginBottom: '10px',
                }}
              >
                {message.userId?.toString() !== currentUserId?.toString() && (
                  <div className="message-avatar" style={{ marginRight: '10px' }}>
                    <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="w-8 h-8 rounded-full" />
                  </div>
                )}
                <div className={`message-content p-2 rounded-lg ${message.userId?.toString() === currentUserId?.toString() ? 'bg-blue-100 text-black' : 'bg-gray-200 text-black'}`}>
                  <div className="message-username text-xs font-semibold">{message.username}</div>
                  <p className="message-text">{sanitizeMessageContent(message.text)}</p>
                  {message.userId?.toString() === currentUserId?.toString() && (
                    <button
                      onClick={() => removeMessage(message.id)}
                      className="remove-message-btn text-xs text-red-500 hover:text-red-700"
                    >
                      Ta bort
                    </button>
                  )}
                </div>
                {message.userId?.toString() === currentUserId?.toString() && (
                  <div className="message-avatar" style={{ marginLeft: '10px' }}>
                    <img src={message.avatar || 'https://i.pravatar.cc/100'} alt="avatar" className="w-8 h-8 rounded-full" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="chat-input-container p-4 border-t">
          <input
            id="inputMessage"
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Skriv ditt meddelande..."
            className="input-message w-full p-2 border rounded-lg"
          />
          <button
            onClick={sendMessage}
            className="send-button ml-2 bg-blue-500 text-white p-2 rounded-lg"
          >
            ✉
          </button>
        </div>
      </div>

      
      <style jsx>{`
        .chat-container {
          max-width: 600px;
          width: 100%;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background-color: #4267B2; /* Facebook blå */
          color: white;
          padding: 10px;
          border-radius: 8px 8px 0 0;
        }

        .chat-title {
          font-size: 18px;
          font-weight: bold;
        }

        .chat-messages {
          padding: 15px;
          flex: 1;
          overflow-y: auto;
          max-height: 400px; /* Justera för att passa designen */
        }

        .message-bubble {
          display: flex;
          align-items: flex-start;
          margin: 5px 0;
        }

        .message-content {
          max-width: 75%;
          border-radius: 20px;
          padding: 10px;
          color: black; /* Svart text för meddelanden */
        }

        .sent .message-content {
          background-color: #d1e7ff; /* Ljusblå bakgrund för användarens meddelanden */
        }

        .received .message-content {
          background-color: #e0e0e0; /* Ljusgrå bakgrund för mottagna meddelanden */
        }

        .input-message {
          border: 1px solid #ccc;
          border-radius: 20px;
          padding: 10px;
          width: 80%;
        }

        .send-button {
          background-color: #4267B2; /* Facebook blå */
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 15px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chat;
