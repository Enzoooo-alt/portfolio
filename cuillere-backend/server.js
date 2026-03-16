const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tu es Cuillère, un assistant IA sympathique sur le site d'Enzo Bourgin. Tu réponds aux questions sur son parcours, ses projets, son blog, son portfolio, et sa passion pour les jeux vidéo et la cybersécurité.",
        },
        { role: "user", content: message },
      ],
    });

    res.json({ response: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error("Erreur OpenAI :", error);
    res.status(500).json({ error: "Erreur lors de la communication avec OpenAI." });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Cuillère backend en ligne sur http://0.0.0.0:${port}`);
});
