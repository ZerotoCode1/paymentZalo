const express =  require('express');
const contactController = require('../controllers/contact');
const publicController = require('../controllers/public');
const router = express.Router();

router.post('/contact', contactController.createNewContact);
router.put('/view/:blogId', publicController.changeBlogView)

module.exports = router;
