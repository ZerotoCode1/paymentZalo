const express =  require('express');
const productController = require('../controllers/product');
const router = express.Router();

router.get('/', productController.getAllProduct);
router.get('/:productId', productController.getProductById);
router.post('/', productController.createNewProduct);
router.put('/:productId', productController.updateProductData);
router.delete('/:productId', productController.deleteProductData);
router.get('/review/:productId', productController.getReviewByProductId);
router.post('/review', productController.createNewReview)
router.post('/review/children', productController.createReviewChildren)
router.delete('/review/children/:childrenId', productController.deleteReviewChildren)
router.put('/review/children/:childrenId/status', productController.updateReviewChildrenStatus)
router.put('/review/children/:reviewId', productController.updateUserReviewChildren)
router.put('/review/:reviewId/status', productController.changeReviewStatus)
router.delete('/review/:reviewId', productController.deleteReviewData)
router.put('/review/:reviewId', productController.updateUserReview)
router.get('/review', productController.getAllReview)
router.get('/:productId/quantity', productController.getProductQuantity)

router.post('/cart', productController.checkoutCart)
router.get('/checkout/list', productController.getListCheckout)
router.delete('/checkout/:checkoutId', productController.deleteCheckoutById)
router.put('/checkout/status/:checkoutId', productController.changeCheckoutStatus)
router.get('/checkout/:checkoutId', productController.getCheckoutById)
router.get('/checkout/user/:userId', productController.getCheckoutByUserId)
router.get('/purchase/:productId/:userId', productController.checkUserProductPurchase)
router.get('/selling/info', productController.getSellingProduct)
module.exports = router;
