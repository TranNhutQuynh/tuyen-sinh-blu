const jwt = require('jsonwebtoken');
const { fail } = require('../utils/response');

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const queryToken = req.query.token;
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.replace('Bearer ', '')
    : queryToken;

  if (!token) {
    return fail(res, 401, 'Bạn chưa đăng nhập admin');
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch (error) {
    return fail(res, 401, 'Token không hợp lệ hoặc đã hết hạn');
  }
};

module.exports = {
  verifyAdmin,
};
