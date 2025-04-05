const { callGemini } = require("../services/geminiService");

async function handleMessage(req, res) {
    try {
        console.log("Incoming Request Body:", req.body);

        const userMessage = req.body.message && req.body.message.trim();
        if (!userMessage) {
            console.error("Empty message received.");
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        console.log("Sending to Gemini:", userMessage);
        const response = await callGemini(userMessage);

        if (!response || response.trim() === "") {
            console.error("No valid response from Gemini.");
            return res.status(500).json({ error: "No valid response from Gemini" });
        }

        console.log("Sending response to frontend:", response);
        return res.json({ message: response });
    } catch (error) {
        console.error("Error in handleMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleMessage };