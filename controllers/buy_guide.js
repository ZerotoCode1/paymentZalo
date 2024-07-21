const asyncHandler = require("express-async-handler");
const { getAllBuyGuide, getTotalBuyGuide, createBuyGuideData, updateGuideData, deleteGuideData, changeGuideActive, changeGuideInActive } = require("../models/buy_guide");

module.exports = {
  getAllBuyGuide: asyncHandler(async (req, res) => {
    const {limit, offset, status} = req?.query
    const buyGuideList = await getAllBuyGuide(status, limit, offset);
    const totalBuyGuide = await getTotalBuyGuide(status);
    res.send({ success: true, payload: {buyGuide: buyGuideList, total: totalBuyGuide} });
  }),

  createNewBuyGuide: asyncHandler(async (req, res) => {
    const {buyGuideData} = req.body
    const {title, guide_description} = buyGuideData
    const createRes = await createBuyGuideData(title, guide_description)
    res.send({ success: createRes });
  }),

  updateBuyGuideData: asyncHandler(async (req, res) => {
    const {buyGuideData} = req.body
    const {buyGuideId} = req.params
    const {title, guide_description} = buyGuideData

    const updateRes = await updateGuideData(title, guide_description, buyGuideId)
    res.send({ success: updateRes });
  }),

  deleteBuyGuideData: asyncHandler(async (req, res) => {
    const {buyGuideId} = req.params
    const deleteRes = await deleteGuideData(buyGuideId)
    res.send({ success: deleteRes });
  }),

  changeGuideActive: asyncHandler(async (req, res) => {
    const {buyGuideId} = req.params
    const changeActiveRes = await changeGuideActive(buyGuideId)
    res.send({ success: changeActiveRes });
  }),

  changeGuideInActive: asyncHandler(async (req, res) => {
    const {buyGuideId} = req.params
    const changeInActiveRes = await changeGuideInActive(buyGuideId)
    res.send({ success: changeInActiveRes });
  }),
};
