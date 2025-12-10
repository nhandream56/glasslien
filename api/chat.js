// api/chat.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  // Chỉ chấp nhận method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình API Key trên Vercel' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // Khởi tạo chat với lịch sử nhận từ Frontend
    const chat = model.startChat({
      history: history || [], // Lịch sử chat cũ
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ reply: text });

  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({ error: "AI đang bận, thử lại sau nhé!" });
  }
};
