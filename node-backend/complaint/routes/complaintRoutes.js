const express = require("express");
const Complaint = require("../model/complaint.js");

const router = express.Router();

// Route to serve the complaint form page
router.get("/complaints", async (req, res) => {
    try {
      const complaints = await Complaint.find().sort({ createdAt: -1 });
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Error fetching complaints", error });
    }
  });
  // Admin route to update status and optionally add a response
router.put("/complaints/:id/status", async (req, res) => {
    const { status, responseMessage } = req.body;

    if (!["Pending", "In Progress", "Resolved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
    }

    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        // Update status
        complaint.status = status;

        // Add a response only if responseMessage is provided
        if (responseMessage) {
            complaint.response.push({ message: responseMessage });
        }

        await complaint.save();
        res.status(200).json({ message: "Complaint updated successfully", complaint });
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint status/response", error });
    }
});

// Route to fetch complaints by username (for attachments or user-specific complaints)
router.get("/complaintsAttachment", async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const complaints = await Complaint.find({ username }).sort({ createdAt: -1 });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Error fetching complaints for user", error });
    }
});

// Route to handle complaint submission
router.post("/complaints", async(req, res) => {
    const { name,username,userType, email, complaint } = req.body;
    if (!name || !username ||!userType|| !email || !complaint) {
        return res.status(400).json({ message: "All fields are required" });
    }
    console.log(name,userType,email,complaint)

    try {
        const newComplaint = new Complaint({ name, username,userType, email, complaint });
        await newComplaint.save();
        res.status(200).json({ message: "Complaint submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error submitting complaint", error });
    }
});

// Route to update a complaint
router.put("/complaints/:id", async(req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true, runValidators: true }
        );
        if (!updatedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json(updatedComplaint);
    } catch (error) {
        res.status(500).json({ message: "Error updating complaint", error });
    }
});

// Route to delete a complaint
router.delete("/complaints/:id", async(req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!deletedComplaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }
        res.status(200).json({ message: "Complaint deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting complaint", error });
    }
});

module.exports = router;