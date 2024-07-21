const express =  require('express');
const blogController = require('../controllers/blog');
const router = express.Router();

router.get('/', blogController.getAllBlog);
router.get('/:blogId/info', blogController.getBlogById);
router.post('/', blogController.createNewBlog);
router.delete('/:blogId/info', blogController.deleteBlogInfo);
router.put('/:blogId/info', blogController.updateBlogData);
router.get('/review/:blogId', blogController.getReviewByBlog);
router.get('/review', blogController.getAllReview)
router.post('/review', blogController.createNewBlogReview)
router.get('/favourite', blogController.getUserBlogFavourite)
router.put('/favourite', blogController.changeUserFavouriteBlog)
router.get('/relative', blogController.getAllRelativeBlog)
router.put('/view/:blogId', blogController.changeBlogView)

module.exports = router;
