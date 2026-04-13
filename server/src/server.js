require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");
const { ensureDefaultAdmin } = require("./services/adminService");

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Kết nối MySQL/TiDB thành công");

    await ensureDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server đang chạy tại cổng ${PORT}`);
    });
  } catch (error) {
    console.error("Không khởi động được server:", error);
    process.exit(1);
  }
};

startServer();
