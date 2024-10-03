import React, { useState } from 'react';

// Enkel funktion för att sanera meddelandetext
const sanitizeMessageContent = (content) => {
  return content.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// Enkla bot-svar
const getBotResponse = () => {
  const botReplies = [
    "Hej! Hur kan jag hjälpa dig?",
    "Vad tänker du på?",
    "Tack för att du skrev!",
    "Det låter intressant!",
  ];
  return botReplies[Math.floor(Math.random() * botReplies.length)];
};

const Chat = () => {
  const [messages, setMessages] = useState([
    { id: 1, user: 'User', content: 'Hej!' },
    { id: 2, user: 'Bot', content: 'Hej! Hur kan jag hjälpa dig?' }
  ]); // Starta med några exempelmeddelanden
  const [newMessage, setNewMessage] = useState(''); // För användarinmatning

  // Funktion för att lägga till nytt meddelande
  const handleNewMessage = (e) => {
    e.preventDefault();

    // Sanera meddelandet och uppdatera listan
    if (newMessage.trim() !== "") {
      const userMessage = { id: messages.length + 1, user: 'User', content: sanitizeMessageContent(newMessage) };
      setMessages([...messages, userMessage]);
      setNewMessage(""); // Töm inmatningsfältet

      // Simulera bot-svar efter 1 sekund
      setTimeout(() => {
        const botMessage = { id: messages.length + 2, user: 'Bot', content: getBotResponse() };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 1000);
    }
  };

  // Funktion för att radera ett meddelande
  const deleteMessage = (id) => {
    // Filtrera bort meddelandet med det specifika id:et
    setMessages(messages.filter((message) => message.id !== id));
  };

  // Funktion för att få avatar-URL baserat på användartyp
  const getAvatarUrl = (user) => {
    return user === 'User' 
      ? 'https://i.pravatar.cc/200?img=3'  // Avatar för användaren
      : 'https://i.pravatar.cc/200?img=1'; // Avatar för bot
  };

  return (
    <div style={{ padding: '10px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9', color: 'black', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Enkel Chat</h2>
      <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '300px', marginBottom: '10px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        {messages.map((message) => (
          <div 
            key={message.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: message.user === 'User' ? 'flex-end' : 'flex-start', 
              margin: '10px 0' 
            }}>
            {message.user === 'Bot' && (
              <img src={getAvatarUrl(message.user)} alt="Bot Avatar" style={{ borderRadius: '50%', width: '40px', height: '40px', marginRight: '10px' }} />
            )}
            <div 
              style={{ 
                maxWidth: '70%', 
                backgroundColor: message.user === 'User' ? '#dcf8c6' : '#f1f0f0', 
                padding: '10px 15px', 
                borderRadius: '20px', 
                position: 'relative', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                fontSize: '14px', 
                lineHeight: '1.4' 
              }}>
              <strong>{message.user}: </strong>
              <span>{message.content}</span>
              {/* Lägg till en diskretare raderingsknapp */}
              <button 
                onClick={() => deleteMessage(message.id)} 
                style={{ 
                  position: 'absolute', 
                  top: '-5px', 
                  right: '-5px', 
                  backgroundColor: 'transparent', 
                  color: 'red', 
                  border: 'none', 
                  fontSize: '16px', 
                  cursor: 'pointer' 
                }}
              >
                &times;
              </button>
            </div>
            {message.user === 'User' && (
              <img src={getAvatarUrl(message.user)} alt="User Avatar" style={{ borderRadius: '50%', width: '40px', height: '40px', marginLeft: '10px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Enkel input för att skicka meddelanden */}
      <form onSubmit={handleNewMessage} style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '20px', 
            border: '1px solid #ccc', 
            outline: 'none', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            fontSize: '14px' 
          }}
        />
        <button 
          type="submit" 
          style={{ 
            marginLeft: '10px', 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '20px', 
            fontSize: '14px', 
            cursor: 'pointer', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}
        >
          Skicka
        </button>
      </form>
    </div>
  );
};

export default Chat;
