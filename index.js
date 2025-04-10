const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = "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";

app.post("/chat", async (req, res) => {
  const userText = req.body.text;

  if (!userText || userText.trim() === "") {
    return res.status(400).json({ error: "Mensagem inválida ou vazia." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o", // ou "gpt-3.5-turbo"
        messages: [{ role: "user", content: userText }],
        temperature: 0.9
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao se comunicar com a OpenAI",
      details: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Proxy ativo!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
