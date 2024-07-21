const asyncHandler = require("express-async-handler");
const { changeBlogView } = require("../models/blog");

module.exports = {
  changeBlogView: asyncHandler(async (req, res) => {
    const { view } = req?.body;
    const { blogId } = req?.params;
    const response = await changeBlogView(blogId, view);
    res.send({ success: response });
  }),
};
