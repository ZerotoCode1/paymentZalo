require("dotenv").config();
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { userSignUp } = require("../models/auth");
const { getUserByEmail, getAdminByEmail } = require("../models/user");
const jwt = require("jsonwebtoken");
const { TOKEN_LIFE, REFRESHTOKEN_LIFE } = require("../utils/contants");
const {
  getTokenByUserId,
  deleteUserToken,
  addUserToken,
  getTokenByAdminId,
  deleteAdminToken,
  addAdminToken,
} = require("../models/token");
const verifyRefreshToken = require("../auth/verifyRefreshToken");

const SECRET_TOKEN = process.env.SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_TOKEN_SECRET_KEY;

module.exports = {
  SIGNUP: asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const getUser = await getUserByEmail(email);

    if (getUser?._id) {
      return res.send({ success: false, error: "Email đã tồn tại" });
    }

    const signupResult = await userSignUp(firstName, lastName, email, password);

    if (!signupResult) {
      return res.send({ success: false, error: "Đăng kí tài khoản thất bại" });
    }
    return res.send({ success: true });
  }),

  LOGIN: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const getUser = await getUserByEmail(email);
      const getAdmin = await getAdminByEmail(email);

      if (!getUser?._id && !getAdmin?._id) {
        return res.send({ success: false, error: "Email không tồn tại" });
      }

      const isMatchUser = bcrypt.compareSync(password, getUser?.password || "");

      const isMatchAdmin = bcrypt.compareSync(
        password,
        getAdmin?.password || ""
      );

      if (!isMatchUser && !isMatchAdmin) {
        return res.send({ success: false, error: "Sai mật khẩu" });
      }

      if (getUser?.status === 0 || getAdmin?.status === 0) {
        return res.send({
          success: false,
          error: "Tài khoản đã bị vô hiệu hoá",
        });
      }

      const userData = isMatchUser
        ? { ...getUser, type: "user" }
        : { ...getAdmin, type: "admin" };

      delete userData.password;

      const token = jwt.sign(userData, SECRET_TOKEN, { expiresIn: TOKEN_LIFE });

      const refreshToken = jwt.sign(userData, REFRESH_SECRET_TOKEN, {
        expiresIn: REFRESHTOKEN_LIFE,
      });

      if (isMatchUser) {
        const getUserToken = await getTokenByUserId(userData?._id);

        if (getUserToken?._id) {
          await deleteUserToken(userData?._id);
        }

        await addUserToken(userData?._id, refreshToken);

      } else {
        const getAdminToken = await getTokenByAdminId(userData?._id);

        if (getAdminToken?._id) {
          await deleteAdminToken(userData?._id);
        }

        await addAdminToken(userData?._id, refreshToken);
      }

      return res.send({
        success: true,
        payload: {
          user: userData,
          token: token,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      return res.send({ success: false, error: "Đăng nhập thất bại" });
    }
  }),

  REFRESH_TOKEN: asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    const verifyToken = await verifyRefreshToken(refreshToken);
    if (verifyToken?._id) {
      delete verifyToken.iat;
      delete verifyToken.exp;
      const accessToken = jwt.sign(verifyToken, SECRET_TOKEN, {
        expiresIn: TOKEN_LIFE,
      });

      return res.send({ success: true, payload: accessToken });
    }

    res.status(400).json("Wrong RefreshToken");
  }),
};
