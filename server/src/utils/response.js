const ok = (res, data, message = 'Thành công') => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const created = (res, data, message = 'Tạo mới thành công') => {
  return res.status(201).json({
    success: true,
    message,
    data,
  });
};

const fail = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = {
  ok,
  created,
  fail,
};
