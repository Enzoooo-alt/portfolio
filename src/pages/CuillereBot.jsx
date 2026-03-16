import React, { useEffect, useMemo, useState } from "react";
import "../styles/pages/CuillereBot.css";

const STORAGE_KEY = "cuillere-chat-history";
const QUICK_PROMPTS = [
  "Analyse ce bug et donne un plan d'action",
  "Propose une architecture avancée pour ce projet",
  "Donne 3 optimisations performance prioritaires",
  "Écris une stratégie de déploiement sécurisée"
];

const detectIntent = (input) => {
  const text = input.toLowerCase();
  if (/bug|erreur|crash|exception|fix/.test(text)) return "debug";
  if (/perf|performance|lag|lent|optim/.test(text)) return "performance";
  if (/archi|architecture|structure|scalable|scalabilit/.test(text)) return "architecture";
  if (/deploy|prod|ci|cd|sécur|security/.test(text)) return "delivery";
  return "general";
};

const buildExpertFallback = (message, history) => {
  const intent = detectIntent(message);
  const recentUserMessages = history
    .filter((entry) => entry.role === "user")
    .slice(-4)
    .map((entry) => `- ${entry.content}`)
    .join("\n");

  const intentPlaybook = {
    debug: {
      analysis: "Le symptôme ressemble à un problème de logique ou de flux de données.",
      action: "Isoler la fonctionnalité, reproduire, vérifier les dépendances et traiter la cause racine.",
      risk: "Corriger en surface peut masquer une régression.",
      next: "Donne-moi le fichier et l'erreur exacte pour un patch précis."
    },
    performance: {
      analysis: "Le point critique probable est rendu CSS/JS ou appels réseau non maîtrisés.",
      action: "Mesurer puis réduire: effets coûteux, rerenders, payload, fréquence d'updates.",
      risk: "Optimiser sans mesure peut dégrader l'UX.",
      next: "Envoie le composant concerné et je priorise les gains rapides."
    },
    architecture: {
      analysis: "Ton besoin suggère une séparation stricte entre UI, logique métier et services.",
      action: "Mettre en place modules par domaine + couche service + contrats de données.",
      risk: "Sur-architecturer trop tôt peut ralentir la livraison.",
      next: "Je peux proposer une structure cible basée sur ton repo actuel."
    },
    delivery: {
      analysis: "Le focus doit être fiabilité de build, sécurité des secrets et rollback rapide.",
      action: "Pipeline CI/CD avec checks, build immuable, variables sécurisées et monitoring.",
      risk: "Un déploiement sans garde-fous augmente les incidents prod.",
      next: "Je peux te donner un plan de release par étapes."
    },
    general: {
      analysis: "Je peux te répondre en mode stratégie orientée exécution.",
      action: "Découper en objectifs, prioriser les blocs critiques, implémenter puis valider.",
      risk: "Une demande trop large peut diluer les résultats.",
      next: "Donne-moi la cible exacte et je déroule le plan opérationnel."
    }
  };

  const play = intentPlaybook[intent];

  return [
    "🧠 Mode expert local activé",
    `Analyse: ${play.analysis}`,
    `Action: ${play.action}`,
    `Risque: ${play.risk}`,
    `Prochaine étape: ${play.next}`,
    recentUserMessages ? `\nContexte récent:\n${recentUserMessages}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

export default function CuillereBot() {
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState("");
  const [lastLatencyMs, setLastLatencyMs] = useState(null);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [expertMode, setExpertMode] = useState(true);
  const apiBaseUrl = import.meta.env.VITE_CUILLERE_API_URL;
  const hasApi = Boolean(apiBaseUrl);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
  }, [messages]);

  const modeLabel = useMemo(() => {
    if (hasApi && expertMode) return "Mode API Expert";
    if (hasApi) return "Mode API";
    return expertMode ? "Mode Expert local" : "Mode démo";
  }, [hasApi, expertMode]);

  const userMessageCount = useMemo(
    () => messages.filter((entry) => entry.role === "user").length,
    [messages]
  );

  const fetchAssistantResponse = async (userInput, history) => {
    if (!hasApi) {
      if (expertMode) {
        return buildExpertFallback(userInput, history);
      }
      return getDemoResponse(userInput);
    }

    const endpoint = `${apiBaseUrl.replace(/\/$/, "")}/chat`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userInput,
        history: history.slice(-12),
        mode: expertMode ? "expert" : "standard",
        intent: detectIntent(userInput)
      })
    });

    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const data = await response.json();
    return data.reply || data.message || "Réponse vide du serveur.";
  };

  const sendMessage = async (userInput, appendUserMessage = true) => {
    const normalizedInput = userInput.trim();
    if (!normalizedInput) return;

    const baseMessages = appendUserMessage
      ? [...messages, { role: "user", content: normalizedInput }]
      : [...messages];

    if (appendUserMessage) {
      setMessages(baseMessages);
      setInput("");
    }

    setLastUserMessage(normalizedInput);
    setLoading(true);
    setLastError("");

    const start = performance.now();

    try {
      const reply = await fetchAssistantResponse(normalizedInput, baseMessages);
      setLastLatencyMs(Math.round(performance.now() - start));
      setMessages([...baseMessages, { role: "assistant", content: reply, ts: Date.now() }]);
    } catch (error) {
      setLastLatencyMs(Math.round(performance.now() - start));
      setLastError("Le serveur IA ne répond pas. Fallback démo activé.");
      const fallbackReply = getDemoResponse(normalizedInput);
      setMessages([...baseMessages, { role: "assistant", content: fallbackReply, ts: Date.now() }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    await sendMessage(input, true);
  };

  const retryLastMessage = async () => {
    if (!lastUserMessage || loading) return;
    await sendMessage(lastUserMessage, false);
  };

  const clearChat = () => {
    setMessages([]);
    setLastError("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const submitQuickPrompt = async (prompt) => {
    if (loading) return;
    await sendMessage(prompt, true);
  };

  return (
    <div className="cuillere-bot">
      <div className="cuillere-header">
        <h2>🤖 Cuillère – Ton assistant IA</h2>
        <span className={`mode-badge ${hasApi ? "api" : "demo"}`}>{modeLabel}</span>
      </div>

      <div className="cuillere-meta">
        <span className="latency-indicator">
          {hasApi
            ? `Latence API: ${lastLatencyMs !== null ? `${lastLatencyMs} ms` : "--"}`
            : "Latence API: mode démo"}
        </span>
        <span className="latency-indicator">Messages user: {userMessageCount}</span>
        <button className="retry-btn" onClick={() => setExpertMode((prev) => !prev)}>
          {expertMode ? "Désactiver expert" : "Activer expert"}
        </button>
        {hasApi && lastUserMessage && (
          <button className="retry-btn" onClick={retryLastMessage} disabled={loading}>
            Réessayer
          </button>
        )}
      </div>

      <div className="quick-prompts" role="group" aria-label="Prompts rapides">
        {QUICK_PROMPTS.map((prompt) => (
          <button key={prompt} className="quick-prompt-btn" onClick={() => submitQuickPrompt(prompt)} disabled={loading}>
            {prompt}
          </button>
        ))}
      </div>

      {lastError && <div className="cuillere-alert">{lastError}</div>}

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <strong>{msg.role === "user" ? "Toi" : "Cuillère"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Cuillère est en train de réfléchir…</div>}
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
        <button onClick={clearChat} className="clear-chat-btn">Vider</button>
      </div>
    </div>
  );
}
