const express =  require('express');
const buyGuideController = require('../controllers/buy_guide');
const router = express.Router();

router.get('/', buyGuideController.getAllBuyGuide);
router.post('/', buyGuideController.createNewBuyGuide);
router.put('/:buyGuideId', buyGuideController.updateBuyGuideData);
router.delete('/:buyGuideId', buyGuideController.deleteBuyGuideData);
router.put('/active/:buyGuideId', buyGuideController.changeGuideActive);
router.put('/inactive/:buyGuideId', buyGuideController.changeGuideInActive);

module.exports = router;
