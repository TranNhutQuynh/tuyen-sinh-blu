const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const ensureDefaultAdmin = async () => {
  const username = process.env.DEFAULT_ADMIN_USERNAME;
  const password = process.env.DEFAULT_ADMIN_PASSWORD;

  if (!username || !password) {
    return;
  }

  try {
    const [rows] = await pool.query('SELECT id FROM admins WHERE username = ? LIMIT 1', [username]);
    if (rows.length) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO admins (username, password_hash, full_name) VALUES (?, ?, ?)',
      [username, passwordHash, 'Quản trị viên mặc định'],
    );
    console.log(`Đã tạo admin mặc định: ${username}`);
  } catch (error) {
    console.warn('Không thể tạo admin mặc định. Hãy kiểm tra bảng admins đã tồn tại chưa.');
  }
};

module.exports = {
  ensureDefaultAdmin,
};
