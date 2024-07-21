require("dotenv").config();
const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");
const moment = require("moment");
const Stripe = require("stripe");
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe = new Stripe(STRIPE_KEY);

module.exports = {
  getProductList: async (
    search,
    category,
    limit,
    offset,
    minPrice,
    maxPrice
  ) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const res = await mysql.query(
        `SELECT * FROM product WHERE ${
          search && search !== "undefined"
            ? `lower(product_name) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `product_name != ''`
        } AND ${
          category && category !== "undefined"
            ? `product_category = ${category}`
            : `product_category != -1`
        } AND ${
          minPrice && minPrice !== "undefined"
            ? `product_price >= ${minPrice}`
            : `product_price >= 0`
        } AND ${
          maxPrice && maxPrice !== "undefined"
            ? `product_price <= ${maxPrice}`
            : `product_price >= 0`
        } ORDER BY _id DESC ${limitOffset} `
      );
      return res || [];
    } catch (error) {
      console.log("getProductList error >>>> ", error);
      return [];
    }
  },

  getTotalProduct: async (search, category, minPrice, maxPrice) => {
    try {
      const res = await mysql.query(
        `SELECT COUNT(_id) as total_product FROM product WHERE ${
          search && search !== "undefined"
            ? `lower(product_name) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `product_name != ''`
        } AND ${
          category && category !== "undefined"
            ? `product_category = ${category}`
            : `product_category != -1`
        } AND ${
          minPrice && minPrice !== "undefined"
            ? `product_price >= ${minPrice}`
            : `product_price >= 0`
        } AND ${
          maxPrice && maxPrice !== "undefined"
            ? `product_price <= ${maxPrice}`
            : `product_price >= 0`
        }`
      );

      if (res?.length) return res?.[0]?.total_product;
      return 0;
    } catch (error) {
      console.log("getTotalProduct error >>>> ", error);
      return 0;
    }
  },

  getProductById: async (productId) => {
    try {
      const res = await mysql.query(
        `SELECT p.*, c.category_name, (SELECT COUNT(_id) FROM product_review pr WHERE pr.product_id = p._id ) as total_review FROM product p JOIN category c ON p.product_category = c._id WHERE p._id=${Number(
          productId
        )}`
      );
      return res?.[0] || {};
    } catch (error) {
      console.log("getProductById error >>>> ", error);
      return {};
    }
  },

  createNewProduct: async (
    product_name,
    product_description,
    product_image,
    product_price,
    sale_price,
    product_category,
    product_quantity,
    start_new, 
    end_new
  ) => {
    try {
      const res =
        await mysql.query(`INSERT INTO product(product_name, product_description, product_image, product_price, sale_price,
        product_category, product_status, create_at, init_quantity, current_quantity, start_new, end_new) VALUES('${product_name}', '${product_description}', '${product_image}', ${Number(
          product_price
        )}, ${Number(sale_price)}, ${Number(
          product_category
        )}, 1, Now(), ${Number(product_quantity)}, ${Number(
          product_quantity
        )}, '${start_new}', '${end_new}')`);

      return res ? true : false;
    } catch (error) {
      console.log("createNewProduct error >>>> ", error);
      return false;
    }
  },

  updateProductData: async (
    {
      product_name,
      product_description,
      product_image,
      product_price,
      sale_price,
      product_category,
      product_quantity,
      start_new, 
      end_new
    },
    productId
  ) => {
    try {
      const res =
        await mysql.query(`UPDATE product SET product_name='${product_name}', product_description='${product_description}', product_image='${product_image}',
      product_price=${Number(product_price)}, sale_price=${Number(
          sale_price
        )}, product_category=${Number(
          product_category
        )}, init_quantity=${Number(product_quantity)}, start_new='${start_new}', end_new = '${end_new}' WHERE _id=${Number(
          productId
        )}`);
      return res ? true : false;
    } catch (error) {
      console.log("updateProductData error >>>> ", error);
      return false;
    }
  },

  deleteProductData: async (productId) => {
    try {
      const res = await mysql.query(
        `DELETE FROM product WHERE _id=${Number(productId)}`
      );
      return res ? true : false;
    } catch (error) {
      console.log("deleteProductData error >>>> ", error);
      return false;
    }
  },

  getReviewByProductId: async (productId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const reviewRes = await mysql.query(
        `SELECT tr.*, ur.first_name, ur.last_name FROM product_review tr JOIN users ur ON tr.user_id = ur._id WHERE product_id=${Number(
          productId
        )} ORDER BY review_date DESC ${limitOffset}`
      );

      const reviewData = [...(reviewRes || [])];

      for (let i = 0; i < reviewData?.length; i++) {
        const userChildrenReview = await mysql.query(
          `SELECT prc.*,  ur.first_name, ur.last_name FROM product_review_children prc JOIN users ur ON prc.user_id = ur._id WHERE review_id=${Number(
            reviewData?.[i]?._id
          )} AND author_type != 'admin'`
        );
        const adminChildrenReview = await mysql.query(
          `SELECT prc.* FROM product_review_children prc WHERE review_id=${Number(
            reviewData?.[i]?._id
          )} AND author_type = 'admin'`
        );
        const allChildrenReview = (userChildrenReview || [])?.concat(
          adminChildrenReview || []
        );

        allChildrenReview?.sort(function (x, y) {
          return y.review_date - x.review_date;
        });

        reviewData[i].children_review = [...allChildrenReview];
      }

      return reviewData || [];
    } catch (error) {
      console.log("getReviewByProductId error >>>> ", error);
      return [];
    }
  },

  getTotalReviewByProductId: async (productId) => {
    try {
      const allItem = await mysql.query(
        `select COUNT(product_review._id) as total_item from product_review WHERE product_id=${Number(
          productId
        )}`
      );

      return allItem?.[0]?.total_item || 0;
    } catch (error) {
      console.log("getTotalReviewByProductId error >>>> ", error);
      return 0;
    }
  },

  createNewReview: async (user_id, review, product_id, star) => {
    try {
      const reviewRes = await mysql.query(
        `INSERT INTO product_review(review_date, user_id, review, product_id, status, star) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(product_id)}, 1, ${Number(star)})`
      );
      return reviewRes ? true : false;
    } catch (error) {
      console.log("createNewReview error >>>> ", error);
      return false;
    }
  },

  changeReviewStatus: async (reviewId, status) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE product_review SET status=${Number(
          status
        )} WHERE _id=${reviewId}`
      );

      return updateRes ? true : false;
    } catch (error) {
      console.log("changeReviewStatus error >>>> ", error);
      return false;
    }
  },

  getAllReview: async () => {
    try {
      const review = await mysql.query(
        `SELECT tr.*, pd.name as product_name, pd.image as product_image, ur.name as user_name, (SELECT COUNT(*) AS number_of_user FROM product_review 
        WHERE product_id = tr.product_id) 
        FROM product_review tr JOIN users ur ON tr.user_id = ur._id JOIN product pd ON pd._id = tr.product_id`
      );
      return review || [];
    } catch (error) {
      console.log("getAllReview error >>>> ", error);
      return [];
    }
  },

  getProductQuantity: async (productId) => {
    try {
      const response = await mysql.query(
        `SELECT current_quantity FROM product WHERE _id=${Number(productId)}`
      );
      if (response) {
        return response?.[0]?.current_quantity;
      }
      return 0;
    } catch (error) {
      console.log("getProductQuantity error >>>> ", error);
      return 0;
    }
  },

  createCartData: async (
    cartData,
    totalPrice,
    paymentMethod,
    userInfo,
    paymentId,
    pickUpOption,
    pickUpTime
  ) => {
    try {
      let checkValid = true;
      for (
        let productIndex = 0;
        productIndex < cartData?.length;
        productIndex++
      ) {
        const quantity = await mysql.query(
          `SELECT current_quantity FROM product WHERE _id=${Number(
            cartData?.[productIndex]?.product_id
          )}`
        );

        if (
          quantity?.[0]?.current_quantity <
          cartData?.[productIndex]?.quantity
        ) {
          checkValid = false;
          break;
        }
      }

      if (!checkValid) {
        return {
          success: false,
          message: "Số lượng sản phẩm trong giỏ hàng vượt quá số lượng hiện có",
        };
      }

      if (paymentMethod === "VISA") {
        const payment = await stripe.paymentIntents.create({
          amount: totalPrice,
          currency: "VND",
          description: "pay water",
          payment_method: paymentId,
          confirm: true,
        });

        if (!payment)
          return {
            success: false,
            message: "Thanh toán thất bại, vui lòng thử lại sau",
          };
      }

      const pickup_time =
        pickUpTime && pickUpTime !== "undefined"
          ? moment(
              moment(pickUpTime, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD")
          : "";

      const insertProduct =
        await mysql.query(`INSERT INTO product_checkout(checkout_date, total_price, user_id, user_first_name, user_last_name, user_address, user_phone, user_email, status, payment_method, pickup_method, pickup_date)
      VALUES(Now(), ${Number(totalPrice)}, ${Number(userInfo?._id)}, '${
          userInfo?.first_name
        }', '${userInfo?.last_name}', '${userInfo?.address}', '${
          userInfo?.phone_number
        }', '${
          userInfo?.email
        }', 1, '${paymentMethod}', '${pickUpOption}', '${pickup_time}')`);

      if (insertProduct) {
        const productInsert = await mysql.query(
          `SELECT _id from product_checkout ORDER BY checkout_date DESC
          LIMIT 1`
        );

        if (productInsert) {
          const { _id } = productInsert?.[0];
          for (let i = 0; i < cartData?.length; i++) {
            await mysql.query(`INSERT INTO product_checkout_detail(checkout_id, product_id, product_name, product_price, product_sale, product_quanlity, proudct_image) VALUES
            (${Number(_id)}, ${Number(cartData[i]?.product_id)}, '${
              cartData[i]?.product_name
            }', ${Number(cartData[i]?.product_price)}, ${
              Number(cartData[i]?.product_sale) >= 0 &&
              Number(cartData[i]?.product_sale) !==
                Number(cartData[i]?.product_price)
                ? Number(cartData[i]?.product_sale)
                : 0
            }, ${Number(cartData[i]?.quantity)}, '${
              cartData[i]?.product_image
            }')`);
          }

          for (let i = 0; i < cartData?.length; i++) {
            const quantity = await mysql.query(
              `SELECT current_quantity FROM product WHERE _id=${Number(
                cartData?.[i]?.product_id
              )}`
            );

            await mysql.query(
              `UPDATE product SET current_quantity=${Number(
                Number(quantity?.[0]?.current_quantity) -
                  Number(cartData?.[i]?.quantity)
              )} WHERE _id=${Number(cartData?.[i]?.product_id)} `
            );
          }

          return { success: true };
        }
      }
      return { success: false, message: "Thêm sản phẩm vào giỏ hàng thất bại" };
    } catch (error) {
      console.log("createCartData error >>>> ", error);
      return { success: false, message: "Thêm sản phẩm vào giỏ hàng thất bại" };
    }
  },

  getAllCheckoutProduct: async (fromData, toDate, limit, offset, status) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);

      const date_from =
        fromData && fromData !== "undefined"
          ? moment(
              moment(fromData, "YYYY-MM-DD")?.startOf("day").toDate()
            ).format("YYYY-MM-DD hh:mm:ss")
          : "";

      const date_to =
        toDate && toDate !== "undefined"
          ? moment(moment(toDate, "YYYY-MM-DD")?.endOf("day").toDate()).format(
              "YYYY-MM-DD hh:mm:ss"
            )
          : "";

      const checkoutRes = await mysql.query(
        `SELECT *
        FROM product_checkout
        WHERE ${
          date_from && date_from !== "undefined"
            ? `date(checkout_date) >= date('${date_from}')`
            : " checkout_date is not null "
        } AND ${
          date_to && date_to !== "undefined"
            ? `date(checkout_date) <= date('${date_to}')`
            : "checkout_date is not null "
        } AND ${
          status && status !== "undefined" && Number(status) !== -1
            ? `status = ${Number(status)}`
            : "status > -1"
        }
        ORDER BY checkout_date DESC ${limitOffset}`
      );
      return checkoutRes || [];
    } catch (error) {
      console.log("getAllCheckoutProduct error >>>> ", error);
      return [];
    }
  },

  deleteCheckoutById: async (checkoutId) => {
    try {
      const deleteCheckoutRes = await mysql.query(
        `DELETE FROM product_checkout_detail WHERE checkout_id=${checkoutId}`
      );

      if (deleteCheckoutRes) {
        const deleteCheckoutDetailRes = await mysql.query(
          `DELETE FROM product_checkout WHERE _id=${checkoutId}`
        );

        if (deleteCheckoutDetailRes) return true;
      }
      return false;
    } catch (error) {
      console.log("deleteCheckoutById error >>>> ", error);
      return false;
    }
  },

  changeCheckoutStatus: async (checkoutId, status) => {
    try {
      if (Number(status) >= 0) {
        const updateRes = await mysql.query(
          `UPDATE product_checkout SET status=${status} WHERE _id=${checkoutId}`
        );
        if (updateRes) return true;
      }
      return false;
    } catch (error) {
      console.log("changeCheckoutStatus error >>>> ", error);
      return false;
    }
  },

  getCheckoutById: async (checkoutId) => {
    try {
      const checkoutRes = await mysql.query(
        `SELECT pcheckout.*, pcheckoutd.* FROM product_checkout AS pcheckout JOIN product_checkout_detail pcheckoutd ON pcheckout._id = pcheckoutd.checkout_id WHERE pcheckout._id=${Number(
          checkoutId
        )}`
      );

      return checkoutRes || [];
    } catch (error) {
      console.log("getCheckoutById error >>>> ", error);
      return [];
    }
  },

  getCheckoutByUserId: async (userId) => {
    try {
      const productRes = await mysql.query(
        `SELECT * FROM product_checkout WHERE user_id=${Number(
          userId
        )} ORDER BY checkout_date DESC`
      );

      return productRes || [];
    } catch (error) {
      console.log("getCheckoutByUserId error >>>> ", error);
      return [];
    }
  },

  checkUserProductPurchase: async (productId, userId) => {
    try {
      const response = await mysql.query(
        `SELECT pcd.product_id FROM product_checkout_detail pcd JOIN product_checkout pc ON pcd.checkout_id = pc._id WHERE pc.user_id=${Number(
          userId
        )} AND pcd.product_id=${Number(productId)}`
      );
      return response?.length ? true : false;
    } catch (error) {
      console.log("checkUserProductPurchase error >>>> ", error);
      return false;
    }
  },

  deleteReviewData: async (reviewId) => {
    try {
      await mysql.query(
        `DELETE FROM product_review_children WHERE review_id=${Number(
          reviewId
        )}`
      );

      const response = await mysql.query(
        `DELETE FROM product_review WHERE _id=${Number(reviewId)}`
      );

      return response ? true : false;
    } catch (error) {
      console.log("deleteReviewData error >>>> ", error);
      return false;
    }
  },

  updateReviewData: async (reviewId, review) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE product_review SET review='${review}' WHERE _id=${reviewId}`
      );

      return updateRes ? true : false;
    } catch (error) {
      console.log("updateReviewData error >>>> ", error);
      return false;
    }
  },

  createReviewChildren: async (review_id, user_id, review, author_type) => {
    try {
      const response =
        await mysql.query(`INSERT INTO product_review_children(review_id, user_id, review, status, review_date, author_type) 
      VALUES(${Number(review_id)}, ${Number(
          user_id
        )}, '${review}', 1, Now(), '${author_type}')`);
      return response ? true : false;
    } catch (error) {
      console.log("createReviewChildren error >>>> ", error);
      return false;
    }
  },

  deleteReviewChildren: async (childrenId) => {
    try {
      const response = await mysql.query(
        `DELETE FROM product_review_children WHERE _id=${Number(childrenId)}`
      );
      return response ? true : false;
    } catch (error) {
      console.log("deleteReviewChildren error >>>> ", error);
      return false;
    }
  },

  updateReviewChildrenStatus: async (childrenId, status) => {
    try {
      const response = await mysql.query(
        `UPDATE product_review_children SET status = ${Number(
          status
        )} WHERE _id=${Number(childrenId)}`
      );
      return response ? true : false;
    } catch (error) {
      console.log("updateReviewChildrenStatus error >>>> ", error);
      return false;
    }
  },

  updateUserReviewChildren: async (childrenId, review) => {
    try {
      const response = await mysql.query(
        `UPDATE product_review_children SET review = '${review}' WHERE _id=${Number(
          childrenId
        )}`
      );
      return response ? true : false;
    } catch (error) {
      console.log("updateUserReviewChildren error >>>> ", error);
      return false;
    }
  },

  getSellingProduct: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const response = await mysql.query(
        `select pd.* from product pd join product_checkout_detail pcd on pd._id = pcd.product_id group by pd._id  order by count(pd._id) DESC ${limitOffset}`
      );
      return response || [];
    } catch (error) {
      console.log("getSellingProduct error >>>> ", error);
      return [];
    }
  },
};
