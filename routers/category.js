const express =  require('express');
const categoryController = require('../controllers/category');
const router = express.Router();

router.get('/', categoryController.getAllCategory);
router.post('/', categoryController.createNewCategory);
router.put('/:categoryId', categoryController.updateCategoryData);
router.delete('/:categoryId', categoryController.deleteCategoryData);

module.exports = router;
