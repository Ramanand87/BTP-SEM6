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
const PROJECT_DETAILS = `Project: GreenPact
🌱 GreenPact – A Crop Trading and Communication Platform
Tech Stack: Django, PostgreSQL, Django Channels (WebSockets), HTML/CSS/JS, Bootstrap, Redis (for Channels), Django REST Framework (if used), Celery (if used for notifications)

🔍 Overview:
GreenPact is a full-stack web application designed to streamline agricultural commerce by connecting farmers and contractors (buyers). It allows users to list crops, post demands, negotiate contracts, communicate in real-time, and build trust through a mutual rating system. The goal is to digitize crop trading while maintaining transparency and efficiency.

📦 Core Apps and Features:
1. user
Centralized authentication and role-based system using Django's AbstractUser or User model.

Two extended profile models:

FarmerProfile: Includes farm details, location, crop history, etc.

ContractorProfile: Contains company name, crop demand patterns, etc.

Clean separation of permissions and dashboard access.

2. crops
Farmers can add, update, or delete crop listings.

Each crop includes name, quantity, price, location, and availability status.

Displayed in a searchable and filterable listing for contractors.

3. demands
Contractors can post their requirements for specific crops.

Fields include crop type, required quantity, price offer, and location.

Farmers can view and respond to demands that match their inventory.

4. contract
Enables formal contract creation between farmer and buyer.

Each contract includes selected crop, agreed price, quantity, and delivery details.

Option for both parties to digitally approve the contract.

Contracts are stored and visible in respective dashboards.

5. ratings
Both farmers and contractors can rate each other after a successful contract.

Each rating includes stars (1–5) and a short review.

Helps improve credibility and maintain a trustworthy ecosystem.

6. chat
Real-time messaging between farmers and contractors.

Implemented using Django Channels and WebSockets.

Enables users to discuss crop details, negotiate deals, and clarify terms.

Messages stored persistently and organized by conversation.

7. notifications (optional but recommended)
Real-time notifications for:

New chat messages

Contract updates

Demand/crop matches

Could be implemented using Django signals + Channels + Celery/Redis.

📊 Additional Features:
Admin panel to monitor users, crops, demands, and ratings.

Search and filter functionality for quick access to relevant crops/demands.

Responsive UI using Bootstrap or similar framework.`;

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