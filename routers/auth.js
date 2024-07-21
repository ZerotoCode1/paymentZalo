const express =  require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/signup', authController.SIGNUP);
router.post('/login', authController.LOGIN);
router.post('/refresh-token', authController.REFRESH_TOKEN);

module.exports = router;
