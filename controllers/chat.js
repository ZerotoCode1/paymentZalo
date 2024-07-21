const chatModel = require("../models/chat");

const getChatByUserId = async (req, res) => {
  try {
    const { userId } = req?.params;
    const data = await chatModel.getUserChatMessage(userId);
    return res.send({ chat: data });
  } catch (error) {
    res.status(400).json({ message: "Lấy danh sách đoạn chat thất bại" });
  }
};

const createUserChat = async (req, res) => {
  try {
    const { userId } = req?.params;
    const { message } = req?.body;
    const response = await chatModel.createUserChat(userId, message);
    if (response) {
      return res.send({ message: "Gửi đoạn chat thành công" });
    }
    return res.status(400).json({ message: "Gửi đoạn chat thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Gửi đoạn chat thất bại" });
  }
};

const createUserChatReply = async (req, res) => {
  try {
    const { userId } = req?.params;
    const { message, owner_reply } = req?.body;
    const response = await chatModel.createUserChatReply(
      userId,
      message,
      owner_reply
    );
    if (response) {
      return res.send({ message: "Gửi đoạn chat thành công" });
    }
    return res.status(400).json({ message: "Gửi đoạn chat thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Gửi đoạn chat thất bại" });
  }
};

const getAllUserHaveChat = async (req, res) => {
  try {
    const data = await chatModel.getAllUserHaveChat();
    if (data?.length) {
      return res.send({ user: data });
    }
    return res.status(400).json({ message: "Lấy danh sách đoạn chat thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Lấy danh sách đoạn chat thất bại" });
  }
};

const updateReadMessage = async (req, res) => {
  try {
    const { userId } = req?.params;

    const response = await chatModel.updateReadMessage(userId);
    if (response) {
      return res.send({ message: "Gửi đoạn chat thành công" });
    }
    return res.status(400).json({ message: "Lấy danh sách đoạn chat thất bại" });
  } catch (error) {
    res.status(400).json({ message: "Lấy danh sách đoạn chat thất bại" });
  }
};


module.exports = {
  getChatByUserId,
  createUserChat,
  createUserChatReply,
  getAllUserHaveChat,
  updateReadMessage
};
