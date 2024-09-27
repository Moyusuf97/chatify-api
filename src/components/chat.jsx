import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Funktion för att sanitera textinnehåll
const sanitizeMessageContent = (content) => {
  const tempElement = document.createElement('div');
  tempElement.innerText = content;
  return tempElement.innerHTML;
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');  // Användarens inmatning
  const [error, setError] = useState('');
  const [currentConversation, setCurrentConversation] = useState(localStorage.getItem('currentConversationId') || '');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Set a default conversation ID
  const defaultConversationId = 'null'; // Uppdatera detta till ett giltigt konversations-ID

  // Om användaren inte är inloggad, omdirigera till inloggningssidan
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Hämta meddelanden för den aktuella konversationen när komponenten laddas
  useEffect(() => {
    const fetchMessages = async () => {
      const conversationId = currentConversation || defaultConversationId;

      if (!conversationId) {
        setError('Ogiltigt konversations-ID.');
        return;
      }

      try {
        const response = await fetch(`https://chatify-api.up.railway.app/messages?conversationId=${conversationId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Misslyckades att hämta meddelanden. Status: ${response.status}. Fel: ${errorText}`);
        }

        const fetchedMessages = await response.json();
        setMessages(fetchedMessages);
      } catch (error) {
        setError(`Misslyckades att hämta meddelanden: ${error.message}`);
        console.error('Fel vid hämtning av meddelanden:', error);
      }
    };

    fetchMessages();
  }, [currentConversation, token]);

  // Funktion för att skicka nytt meddelande
  const handleNewMessage = async (e) => {
    e.preventDefault();
    setError('');

    if (!newMessage.trim()) {  // Kontrollera om meddelandet är tomt
      setError('Meddelandet kan inte vara tomt.');
      return;
    }

    const conversationId = currentConversation || defaultConversationId;

    // Lägg till loggning för att säkerställa att conversationId är korrekt
    console.log('Skickar meddelande till conversationId:', conversationId);

    if (!conversationId) {
      setError('Ogiltigt konversations-ID.');
      return;
    }

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: sanitizeMessageContent(newMessage.trim()),  // Saniterar innehållet
          conversationId: conversationId  // Använd aktuellt eller fallback-konversation-ID
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Misslyckades att skicka meddelandet. Status: ${response.status}. Fel: ${errorText}`);
      }

      // Uppdatera meddelandelistan
      const updatedMessages = await fetchMessages(); // Uppdaterade meddelanden
      setMessages(updatedMessages);
      setNewMessage('');  // Rensa inmatningsfältet efter att meddelandet skickats
    } catch (error) {
      setError(`Misslyckades att skicka meddelandet: ${error.message}`);
      console.error('Fel vid skickande av meddelande:', error);
    }
  };

  // Funktion för att radera meddelande
  const handleDeleteMessage = async (msgId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${msgId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Misslyckades att radera meddelandet. Status: ${response.status}. Fel: ${errorText}`);
      }

      // Uppdatera meddelandelistan efter radering
      const updatedMessages = messages.filter((message) => message.id !== msgId);
      setMessages(updatedMessages);
    } catch (error) {
      setError(`Misslyckades att radera meddelandet: ${error.message}`);
      console.error('Fel vid radering av meddelande:', error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      {error && <div className="error-bubble">{error}</div>}
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.userId === localStorage.getItem('currentUserId') ? 'right' : 'left'}`}
          >
            <p dangerouslySetInnerHTML={{ __html: sanitizeMessageContent(message.content) }}></p>
            {message.userId === localStorage.getItem('currentUserId') && (
              <button onClick={() => handleDeleteMessage(message.id)}>Radera</button>
            )}
          </div>
        ))}
      </div>

      {/* Formulär för att skapa nytt meddelande */}
      <form onSubmit={handleNewMessage}>
        <input
          type="text"
          name="messageInput"
          value={newMessage}  // Binder till det nya meddelandet
          onChange={(e) => setNewMessage(e.target.value)}  // Uppdaterar state när användaren skriver
          placeholder="Skriv ett meddelande"
        />
        <button type="submit">Skicka</button>
      </form>
    </div>
  );
};

export default Chat;
