import express from "express";

const router = express.Router();

// Route to serve the complaint form page
router.get("/complaint", (req, res) => {
    res.send("Complaint form route reached");
});

// Route to handle complaint submission
router.post("/complaints", (req, res) => {
    const { name, email, complaint } = req.body;
    if (!name || !email || !complaint) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Logic to store complaint in the database (replace with actual DB logic)
    console.log("Complaint received:", { name, email, complaint });
    res.status(200).json({ message: "Complaint submitted successfully" });
});

export default router;