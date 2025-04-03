// const { callGemini } = require("../services/geminiService");

// async function handleMessage(req, res) {
//     try {
//         const userMessage = req.body.message;

//         if (!userMessage || userMessage.trim() === "") {
//             return res.status(400).json({ error: "Empty message" });
//         }

//         const response = await callGemini(userMessage);

//         if (!response) {
//             return res.status(500).json({ error: "No response from Gemini" });
//         }

//         return res.json({ message: response });
//     } catch (error) {
//         console.error("Error in handleMessage:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// module.exports = { handleMessage };
// const { callGemini } = require("../services/geminiService");

// async function handleMessage(req, res) {
//     try {
//         const userMessage = req.body.message ? "" : req.body.message.trim();

//         // 📌 Handle empty queries
//         if (!userMessage) {
//             return res.status(400).json({ error: "Message cannot be empty" });
//         }

//         const response = await callGemini(userMessage);

//         // 📌 Ensure Gemini returns a valid response
//         if (!response || response.trim() === "") {
//             return res.status(500).json({ error: "No valid response from Gemini" });
//         }

//         return res.json({ message: response });
//     } catch (error) {
//         console.error("Error in handleMessage:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// }

// module.exports = { handleMessage };

const { callGemini } = require("../services/geminiService");

async function handleMessage(req, res) {
    try {
        console.log("🔍 Incoming Request Body:", req.body);

        // 🛑 Ensure the user message is valid
        const userMessage = req.body.message && req.body.message.trim();
        if (!userMessage) {
            console.error("❌ Empty message received.");
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        console.log("📤 Sending to Gemini:", userMessage);
        const response = await callGemini(userMessage);

        // 🛑 Ensure Gemini returns a response
        if (!response || response.trim() === "") {
            console.error("❌ No valid response from Gemini.");
            return res.status(500).json({ error: "No valid response from Gemini" });
        }

        console.log("📥 Sending response to frontend:", response);
        return res.json({ message: response });
    } catch (error) {
        console.error("❌ Error in handleMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { handleMessage };