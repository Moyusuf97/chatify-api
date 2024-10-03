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

  return (
    <div style={{ padding: '10px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#f9f9f9', color: 'black' }}> {/* Sätt textfärg här */}
      <h2>Enkel Chat</h2>
      <div style={{ border: '1px solid #ddd', padding: '10px', minHeight: '300px', marginBottom: '10px' }}>
        {messages.map((message) => (
          <div key={message.id} style={{ textAlign: message.user === 'User' ? 'right' : 'left', margin: '5px 0' }}>
            <strong>{message.user}: </strong>
            <span>{message.content}</span>
          </div>
        ))}
      </div>

      {/* Enkel input för att skicka meddelanden */}
      <form onSubmit={handleNewMessage} style={{ display: 'flex' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>
          Skicka
        </button>
      </form>
    </div>
  );
};

export default Chat;
