const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ Missing GEMINI_API_KEY in environment variables!");
}

const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Function to get real-time date & time
function getCurrentDateTime() {
    return new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
}

// 📌 Static Project Details (Modify as needed)
const PROJECT_DETAILS = `Project: Student Chatbot
- Name: Janmesh Rajput
- Age: 19
- College: IIIT Pune
- Functionality: Our project name is GreenPact which aims to provide a trust contract between farmers/sellers and customers/buyers. Both of them can interact with each other and make a contract.
- Restrictions: Do NOT answer general questions outside this scope.`;

// 📌 Function to call Gemini API
async function callGemini(userQuery) {
    try {
        const currentDateTime = getCurrentDateTime();

        // 🔥 Strictly limit the chatbot’s response scope
        const prompt = `
        ${PROJECT_DETAILS}
        Date & Time: ${currentDateTime}
        User Query: ${userQuery}
        Instructions: Respond only based on the provided project details. If the question is unrelated, respond with: "I can only answer project-related queries."
        `;

        console.log("📤 Sending Prompt:", prompt);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const textResponse = await result.response.text();

        console.log("📥 Gemini Response:", textResponse);
        return textResponse || "I can only answer project-related queries.";
    } catch (error) {
        console.error("❌ Error calling Gemini API:", error);
        return "Sorry, I couldn't process your request.";
    }
}

module.exports = { callGemini };