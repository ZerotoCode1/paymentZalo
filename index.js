const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const app = express();
const routerPrivate = express.Router();
const routerPublic = express.Router();
const cors = require("cors");
require("dotenv").config();
const http = require("http");

const verifyToken = require("./auth/checkToken");
const authRouter = require("./routers/auth");
const categoryRouter = require("./routers/category");
const userRouter = require("./routers/user");
const blogRouter = require("./routers/blog");
const productRouter = require("./routers/product");
const publicRouter = require("./routers/public");
const contactRouter = require("./routers/contact");
const buyGuideRouter = require("./routers/buy_guide");
const chatRouter = require("./routers/chat");
const zaloPayment = require("./routers/payment");
const {
  createUserChat,
  createUserChatReply,
  getUserChatMessage,
  getAllUserHaveChat,
} = require("./models/chat");

const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "DOAN"],
    maxAge: 4 * 7 * 24 * 60 * 60 * 1000,
  })
);

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// ! ================== connect socket ... ================== //
socketIo.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  socket.on("sendDataClient", async function (data) {
    const { userId, message, adminId, type } = data;
    let createRes = false;
    if (type === "user-chat") {
      createRes = await createUserChat(userId, message);
    } else {
      createRes = await createUserChatReply(userId, message, adminId);
    }

    if (createRes) {
      const chatData = await getUserChatMessage(userId);
      chatData.sort(function (x, y) {
        return x.chatDate - y.chatDate;
      });
      socketIo.emit("sendDataServer", { data: chatData });
      const newAllUser = await getAllUserHaveChat();
      socketIo.emit("sendListUserServer", { data: newAllUser });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

routerPublic.use("/api/auth", authRouter);
routerPublic.use("/api/public", publicRouter);
app.use(routerPublic);

routerPrivate.use(verifyToken);
routerPrivate.use("/api/category", categoryRouter);
routerPrivate.use("/api/blog", blogRouter);
routerPrivate.use("/api/user", userRouter);
routerPrivate.use("/api/product", productRouter);
routerPrivate.use("/api/contact", contactRouter);
routerPrivate.use("/api/buy-guide", buyGuideRouter);
routerPrivate.use("/api/chat", chatRouter);
routerPublic.use("/api/payment", zaloPayment);

app.use(routerPrivate);

const PORT = process.env.PORT || 5005;
server.listen(PORT, () => console.log(`App running on port: ${PORT}`));
