const router = require("express").Router();
const chatController = require("../controllers/chat");

router.get('/user', chatController.getAllUserHaveChat);
router.get('/user/:userId', chatController.getChatByUserId);
router.post('/user/:userId', chatController.createUserChat);
router.post('/user/reply/:userId', chatController.createUserChatReply);
router.put('/user/status/read/:userId', chatController.updateReadMessage);

module.exports = router;
