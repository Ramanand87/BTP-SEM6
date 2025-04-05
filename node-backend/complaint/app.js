const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const complaintRoutes = require("./routes/complaintRoutes.js");

dotenv.config();

const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("DB Connection Error:", err));

app.use("/", complaintRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));