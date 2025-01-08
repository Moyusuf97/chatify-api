import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sidenav';

const Chat = () => {
  const location = useLocation();
  const token = location.state?.token;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  const fetchConversations = async () => {
    try {
      const response = await fetch('https://chatify-api.up.railway.app/conversations', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations.');
      }

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      setError('Failed to load conversations.');
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages.');
      }

      const data = await response.json();
      setMessages(data);
      setSelectedConversation(conversationId);
    } catch (error) {
      setError('Failed to load messages.');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation) return;

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: inputMessage,
          conversationId: selectedConversation,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message.');
      }

      const newMessage = await response.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
    } catch (error) {
      setError('Failed to send message.');
    }
  };

  const handleConversationSelect = (conversationId) => {
    fetchMessages(conversationId);
  };

  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <Sidebar conversations={conversations} onConversationSelect={handleConversationSelect} />
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <h2>Conversation {selectedConversation}</h2>
            </div>

            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.userId === 'currentUser' ? 'sent' : 'received'}`}>
                    <p>{msg.text}</p>
                  </div>
                ))
              ) : (
                <p>No messages yet. Start the conversation!</p>
              )}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div className="chat-placeholder">
            <p>Select a conversation to start chatting.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-page {
          display: flex;
          height: 100vh;
        }

        .chat-sidebar {
          width: 25%;
          background-color: #f5f5f5;
          border-right: 1px solid #ddd;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          padding: 10px;
          background-color: #007bff;
          color: #fff;
          text-align: center;
        }

        .chat-messages {
          flex: 1;
          padding: 10px;
          overflow-y: auto;
          background-color: #e9ecef;
        }

        .message {
          margin-bottom: 10px;
          padding: 10px;
          border-radius: 10px;
        }

        .sent {
          background-color: #d1e7ff;
          align-self: flex-end;
        }

        .received {
          background-color: #f1f1f1;
          align-self: flex-start;
        }

        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #ddd;
        }

        .chat-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .chat-input button {
          margin-left: 10px;
          padding: 10px 15px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Chat;
