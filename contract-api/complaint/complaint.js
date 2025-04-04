const express = require("express");
const Complaint = require("./complaintModel.js"); 

const router = express.Router();

// Route to serve the complaint form page
router.get("/complaint", (req, res) => {
  res.send("Complaint form route reached");
});

// Route to handle complaint submission
router.post("/complaints", async (req, res) => {
  const { name, email, complaint } = req.body;
  if (!name || !email || !complaint) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newComplaint = new Complaint({ name, email, complaint });
    await newComplaint.save();
    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting complaint", error });
  }
});

// Route to update a complaint
router.put("/complaints/:id", async (req, res) => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
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
router.delete("/complaints/:id", async (req, res) => {
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