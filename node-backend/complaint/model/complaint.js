const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  complaint: { type: String, required: true },
  username: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["farmer", "contractor"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "inProgress"],
    default: "Pending",
  },
  response: [
    {
      message: { type: String },
      respondedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Complaint = mongoose.model("Complaint", complaintSchema);
module.exports = Complaint;
