const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API tuyển sinh đang chạy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
