const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// 🔐 Lê a chave da variável de ambiente
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
  console.log("🔑 Chave recebida:", OPENAI_API_KEY); // <-- Debug pra confirmar leitura da variável

  const userText = req.body.text;

  if (!userText || userText.trim() === "") {
    return res.status(400).json({ error: "Mensagem inválida ou vazia." });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Mais estável para contas novas
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
    console.error("❌ Erro na OpenAI:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erro ao se comunicar com a OpenAI",
      details: error.response?.data || error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Proxy ativo e pronto para receber POST /chat");
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
