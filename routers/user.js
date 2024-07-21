const express =  require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.get('/', userController.getUserList);
router.get('/:userId', userController.getUserById);
router.delete('/:userId', userController.deleteUserInfo);
router.put('/status/:userId', userController.updateUserStatus);
router.post('/', userController.createNewUser);
router.put('/:userId', userController.updateUserInfo);

module.exports = router;
