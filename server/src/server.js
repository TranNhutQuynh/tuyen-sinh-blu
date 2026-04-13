require("dotenv").config();
const app = require("./app");
const pool = require("./config/db");
const { ensureDefaultAdmin } = require("./services/adminService");
const dictionaryRoute = require("./routes/dictionaryRoutes");

app.use("/api", dictionaryRoute);

require(dotenv).config();
const app =require("./app")
const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Kết nối MySQL thành công");

    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Không khởi động được server:", error.message);
    process.exit(1);
  }
};

startServer();
