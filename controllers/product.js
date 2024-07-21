const asyncHandler = require("express-async-handler");
const {
  getProductList,
  createNewProduct,
  getProductById,
  updateProductData,
  deleteProductData,
  getTotalProduct,
  getReviewByProductId,
  getTotalReviewByProductId,
  createNewReview,
  changeReviewStatus,
  getAllReview,
  getProductQuantity,
  deleteReviewData,
  updateReviewData,
  createReviewChildren,
  deleteReviewChildren,
  updateReviewChildrenStatus,
  updateUserReviewChildren,
  createCartData,
  getAllCheckoutProduct,
  deleteCheckoutById,
  changeCheckoutStatus,
  getCheckoutById,
  getCheckoutByUserId,
  checkUserProductPurchase,
  getSellingProduct,
} = require("../models/product");
const moment = require("moment");

module.exports = {
  getAllProduct: asyncHandler(async (req, res) => {
    const { search, category, limit, offset, minPrice, maxPrice } = req?.query;
    const response = await getProductList(
      search,
      category,
      limit,
      offset,
      minPrice,
      maxPrice
    );

    const totalProduct = await getTotalProduct(
      search,
      category,
      minPrice,
      maxPrice
    );

    res.send({
      success: true,
      payload: { product: response, total: totalProduct },
    });
  }),

  getProductById: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await getProductById(productId);
    res.send({ success: true, payload: response });
  }),

  createNewProduct: asyncHandler(async (req, res) => {
    const { productData } = req?.body;
    const {
      product_name,
      product_description,
      product_image,
      product_price,
      sale_price,
      product_category,
      product_quantity,
      start_new,
      end_new
    } = productData;

    const response = await createNewProduct(
      product_name,
      product_description,
      product_image,
      product_price,
      sale_price,
      product_category,
      product_quantity,
      start_new,
      end_new
    );
    res.send({ success: true, payload: response });
  }),

  updateProductData: asyncHandler(async (req, res) => {
    const { productData } = req?.body;
    const { productId } = req?.params;
    const response = await updateProductData(productData, productId);
    res.send({ success: response });
  }),

  deleteProductData: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await deleteProductData(productId);
    res.send({ success: response });
  }),

  getReviewByProductId: asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { limit, page } = req.query;
    const response = await getReviewByProductId(productId, limit, page);
    const total = await getTotalReviewByProductId(productId);
    res.send({ success: true, payload: { review: response, total: total } });
  }),

  createNewReview: asyncHandler(async (req, res) => {
    const { user_id, review, product_id, star } = req.body;
    const response = await createNewReview(user_id, review, product_id, star);
    res.send({ success: response });
  }),

  changeReviewStatus: asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { status } = req.body;
    const response = await changeReviewStatus(reviewId, status);
    res.send({ success: response });
  }),

  getAllReview: asyncHandler(async (req, res) => {
    const response = await getAllReview();
    res.send({ success: true, payload: response });
  }),

  checkoutCart: asyncHandler(async (req, res) => {
    const {
      cartData,
      totalPrice,
      paymentMethod,
      userInfo,
      paymentId,
      pickUpOption,
      pickUpTime,
    } = req.body;

    const response = await createCartData(
      cartData,
      totalPrice,
      paymentMethod,
      userInfo,
      paymentId,
      pickUpOption,
      pickUpTime
    );
    res.send(response);
  }),

  getListCheckout: asyncHandler(async (req, res) => {
    const { fromData, toDate, limit, offset, status } = req?.query;
    const response = await getAllCheckoutProduct(
      fromData,
      toDate,
      limit,
      offset,
      status
    );
    res.send({ success: true, payload: response });
  }),

  deleteCheckoutById: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const response = await deleteCheckoutById(checkoutId);
    res.send({ success: response });
  }),

  changeCheckoutStatus: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const { status } = req?.body;
    const response = await changeCheckoutStatus(checkoutId, status);
    res.send({ success: response });
  }),

  getCheckoutById: asyncHandler(async (req, res) => {
    const { checkoutId } = req?.params;
    const response = await getCheckoutById(checkoutId);
    res.send({ success: true, payload: response });
  }),

  getCheckoutByUserId: asyncHandler(async (req, res) => {
    const { userId } = req?.params;
    const response = await getCheckoutByUserId(userId);
    res.send({ success: true, payload: response });
  }),

  checkUserProductPurchase: asyncHandler(async (req, res) => {
    const { productId, userId } = req?.params;
    const response = await checkUserProductPurchase(productId, userId);
    res.send({ success: true, payload: response });
  }),

  getProductQuantity: asyncHandler(async (req, res) => {
    const { productId } = req?.params;
    const response = await getProductQuantity(productId);
    res.send({ success: true, payload: response });
  }),

  deleteReviewData: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const response = await deleteReviewData(reviewId);
    res.send({ success: response });
  }),

  updateUserReview: asyncHandler(async (req, res) => {
    const { reviewId } = req?.params;
    const { review } = req?.body;
    const response = await updateReviewData(reviewId, review);
    res.send({ success: response });
  }),

  createReviewChildren: asyncHandler(async (req, res) => {
    const { review_id, user_id, review, author_type } = req?.body;
    const response = await createReviewChildren(
      review_id,
      user_id,
      review,
      author_type
    );
    res.send({ success: response });
  }),

  deleteReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const response = await deleteReviewChildren(childrenId);
    res.send({ success: response });
  }),

  updateReviewChildrenStatus: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { status } = req?.body;
    const response = await updateReviewChildrenStatus(childrenId, status);
    res.send({ success: response });
  }),

  updateUserReviewChildren: asyncHandler(async (req, res) => {
    const { childrenId } = req?.params;
    const { review } = req?.body;
    const response = await updateUserReviewChildren(childrenId, review);
    res.send({ success: response });
  }),

  getSellingProduct: asyncHandler(async (req, res) => {
    const { limit, offset } = req?.query;
    const response = await getSellingProduct(limit, offset);

    res.send({ success: true, payload: response });
  }),

};
