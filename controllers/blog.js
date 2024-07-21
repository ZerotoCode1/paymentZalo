const asyncHandler = require("express-async-handler");
const {
  getTotalBlog,
  getAllBlog,
  getBlogInfo,
  createNewBlog,
  deleteBlogInfo,
  updateBlogData,
  getReviewByBlog,
  createBlogReview,
  getUserBlogFavourite,
  changeUserFavouriteBlog,
  getAllRelativeBlog,
  changeBlogView,
} = require("../models/blog");

module.exports = {
  getAllBlog: asyncHandler(async (req, res) => {
    const { limit, offset, search } = req.query;
    const blogList = await getAllBlog(limit, offset, search);
    const totalBlog = await getTotalBlog(search);
    res.send({ success: true, payload: { blog: blogList, total: totalBlog } });
  }),

  getBlogById: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const blogInfo = await getBlogInfo(blogId);
    res.send({ success: true, payload: blogInfo });
  }),

  createNewBlog: asyncHandler(async (req, res) => {
    const { title, desc, image } = req.body;
    const createRes = await createNewBlog(title, desc, image);
    res.send({ success: createRes });
  }),

  deleteBlogInfo: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const deleteRes = await deleteBlogInfo(blogId);
    res.send({ success: deleteRes });
  }),

  updateBlogData: asyncHandler(async (req, res) => {
    const { title, desc, image } = req.body;
    const { blogId } = req.params;
    const updateRes = await updateBlogData(title, desc, image, blogId);
    res.send({ success: updateRes });
  }),

  getReviewByBlog: asyncHandler(async (req, res) => {
    const { blogId } = req.params;
    const { limit, offset } = req.query;
    const postList = await getReviewByBlog(blogId, limit, offset);
    res.send({ success: true, payload: postList });
  }),

  getAllReview: asyncHandler(async (req, res) => {}),

  createNewBlogReview: asyncHandler(async (req, res) => {
    const { user_id, review, blog_id } = req.body;
    const createRes = await createBlogReview(user_id, review, blog_id, 1);
    res.send({ success: createRes });
  }),

  getUserBlogFavourite: asyncHandler(async (req, res) => {
    const { userId, blogId } = req.query;
    const favouriteRes = await getUserBlogFavourite(userId, blogId);
    res.send({ success: true, payload: favouriteRes });
  }),

  changeUserFavouriteBlog: asyncHandler(async (req, res) => {
    const { userId, blogId } = req.query;
    const { status } = req.body;
    const changeRes = await changeUserFavouriteBlog(userId, blogId, status);
    res.send({ success: changeRes });
  }),

  getAllRelativeBlog: asyncHandler(async (req, res) => {
    const { limit, offset, existBlog } = req?.query;
    const response = await getAllRelativeBlog(limit, offset, existBlog);
    res.send({ success: true, payload: response });
  }),

  changeBlogView: asyncHandler(async (req, res) => {
    const { view } = req?.body;
    const { blogId } = req?.params;
    const response = await changeBlogView(blogId, view);
    res.send({ success: response });
  }),
};
