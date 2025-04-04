const express = require('express')
const mongoose = require('mongoose');
const complaintRoutes = require("./complaint.js");

const app = express();
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));

app.use("/", complaintRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));