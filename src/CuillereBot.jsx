import React, { useState } from "react";
import "./CuillereBot.css";

export default function CuillereBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Réponses simulées pour le démo
  const demoResponses = {
    "bonjour": "Bonjour ! Je suis Cuillère, votre assistant IA. Comment puis-je vous aider ?",
    "comment ça va": "Je vais très bien, merci ! Prêt à vous assister 😊",
    "aide": "Je peux vous aider avec des questions générales, des explications, ou simplement discuter !",
    "default": "Je suis désolé, je fonctionne en mode démonstration pour le moment. Pour une version complète, configurez une clé API OpenAI."
  };

  const getDemoResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    for (const [key, response] of Object.entries(demoResponses)) {
      if (lowerMessage.includes(key) && key !== "default") {
        return response;
      }
    }
    return demoResponses.default;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    // Simulation de délai d'API
    setTimeout(() => {
      const reply = getDemoResponse(input);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="cuillere-bot">
      <h2>🤖 Cuillère – Ton assistant IA (Mode Démo)</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "Toi" : "Cuillère"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Cuillère est en train de réfléchir...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Pose ta question ici..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Envoyer</button>
      </div>
    </div>
  );
}
