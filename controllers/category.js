const asyncHandler = require("express-async-handler");
const { getAllCategory, getTotalCategory, createCategoryData, updateCategoryData, deleteCategoryData } = require("../models/category");

module.exports = {
  getAllCategory: asyncHandler(async (req, res) => {
    const {limit, offset} = req?.query
    const categoryList = await getAllCategory(limit, offset);
    const totalCategory = await getTotalCategory();
    res.send({ success: true, payload: {category: categoryList, total: totalCategory} });
  }),

  createNewCategory: asyncHandler(async (req, res) => {
    const {categoryData} = req.body
    const {name, image, category_description} = categoryData
    const createRes = await createCategoryData(name, image, category_description)
    res.send({ success: createRes });
  }),

  updateCategoryData: asyncHandler(async (req, res) => {
    const {categoryData} = req.body
    const {categoryId} = req.params
    const {name, image, category_description} = categoryData

    const updateRes = await updateCategoryData(name, image, category_description, categoryId)
    res.send({ success: updateRes });
  }),

  deleteCategoryData: asyncHandler(async (req, res) => {
    const {categoryId} = req.params
    const deleteRes = await deleteCategoryData(categoryId)
    res.send({ success: deleteRes });
  })
};
