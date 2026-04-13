const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const { fail, ok } = require("../utils/response");

const login = async (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '');

  console.log('req.body =', req.body);
  console.log('username =', JSON.stringify(username));

  if (!username || !password) {
    return fail(res, 400, "Vui lòng nhập tên đăng nhập và mật khẩu");
  }

  const [rows] = await pool.query(
    "SELECT id, username, password_hash, role, full_name FROM admins WHERE username = ? LIMIT 1",
    [username]
  );

  console.log('rows =', rows);

  if (!rows.length) {
    return fail(res, 401, "Sai tên đăng nhập hoặc mật khẩu");
  }

  const admin = rows[0];
  const isMatched = await bcrypt.compare(password, admin.password_hash);

  console.log('db admin =', admin);
  console.log('isMatched =', isMatched);

  if (!isMatched) {
    return fail(res, 401, "Sai tên đăng nhập hoặc mật khẩu");
  }


  const token = jwt.sign(
    {
      adminId: admin.id,
      username: admin.username,
      role: admin.role,
      fullName: admin.full_name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );

  return ok(
    res,
    {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        fullName: admin.full_name,
      },
    },
    "Đăng nhập thành công"
  );
};

module.exports = {
  login,
};
