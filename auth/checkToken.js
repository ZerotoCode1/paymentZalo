require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_TOKEN = process.env.SECRET_TOKEN;

module.exports = function (req, res, next) {
  if (req.method !== "GET") {
    const token = req.header("auth-token");
    if (!token)
      return res.status(401).send("Vui lòng đăng nhập để được truy cập");
    try {
      const checkToken = jwt.verify(token, SECRET_TOKEN);
      req.user = checkToken;
      next();
    } catch (err) {
      res.status(401).send("Token không hợp lệ");
    }
  } else {
    next();
  }
};
