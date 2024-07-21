const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  getAllBlog: async (limit, offset, search) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const getQuery = await mysql.query(
        `SELECT _id, blog_title, blog_desc, blog_image, create_at, 
        (SELECT COUNT(br._id) FROM blog_review br WHERE br.blog_id = blog._id ) AS count_review,
        (SELECT COUNT(bf.user_id) FROM blog_favourite bf WHERE bf.blog_id = blog._id ) AS count_favourite
        FROM blog WHERE ${
          search && search !== "undefined"
            ? `lower(blog_title) LIKE '%${search
                ?.toLowerCase()
                ?.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")}%'`
            : `blog_title != ''`
        } ORDER BY create_at DESC ${limitOffset}`
      );
      if (getQuery) return getQuery;
      else return [];
    } catch (error) {
      console.log("getAllBlog error >>>> ", error);
      return [];
    }
  },

  getTotalBlog: async (search) => {
    try {
      const postTotal = await mysql.query(
        `SELECT COUNT(_id) as total_blog FROM blog 
         WHERE ${
           search && search !== "undefined"
             ? `blog_title LIKE '%${search}%'`
             : `blog_title != ''`
         }`
      );

      return postTotal?.[0]?.total_blog || 0;
    } catch (error) {
      console.log("getTotalBlog error >>>> ", error);
      return 0;
    }
  },

  getBlogInfo: async (blogId) => {
    try {
      if (blogId) {
        const getQuery = await mysql.query(
          `SELECT _id, blog_title, blog_desc, blog_image, blog_view, create_at,
          (SELECT COUNT(br._id) FROM blog_review br WHERE br.blog_id = blog._id ) AS count_review,
          (SELECT COUNT(bf.user_id) FROM blog_favourite bf WHERE bf.blog_id = blog._id ) AS count_favourite
          FROM blog WHERE _id=${Number(blogId)}`
        );

        if (getQuery?.length) return getQuery?.[0];
      }
      return {};
    } catch (error) {
      console.log("getBlogInfo error >>>> ", error);
      return {};
    }
  },

  createNewBlog: async (title, desc, image) => {
    try {
      const insertQuery = await mysql.query(
        `INSERT INTO blog(blog_title, blog_desc, blog_image, create_at, blog_view) VALUES('${title}', '${desc}', '${image}', Now(), 0)`
      );
      return insertQuery ? true : false;
    } catch (error) {
      console.log("createNewBlog error >>>> ", error);
      return false;
    }
  },

  deleteBlogInfo: async (blogId) => {
    try {
      const deletePost = await mysql.query(
        `DELETE FROM blog WHERE _id = ${blogId}`
      );
      return deletePost ? true : false;
    } catch (error) {
      console.log("deleteBlogInfo error >>>> ", error);
      return false;
    }
  },

  updateBlogData: async (title, desc, image, blogId) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE blog SET blog_title='${title}', blog_desc='${desc}', blog_image='${image}' WHERE _id=${Number(
          blogId
        )}`
      );
      return updateRes ? true : false;
    } catch (error) {
      console.log("updateBlogData error >>>> ", error);
      return false;
    }
  },

  getReviewByBlog: async (blogId, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const queryRes = await mysql.query(
        `SELECT r.*, u.last_name, u.first_name FROM blog_review r JOIN users u ON r.user_id = u._id WHERE r.blog_id=${Number(
          blogId
        )} ${limitOffset}`
      );

      const totalReview = await mysql.query(
        `select COUNT(blog_review._id) as total_item from blog_review WHERE blog_id=${Number(
          blogId
        )}`
      );

      if (queryRes)
        return {
          review: queryRes,
          total: totalReview?.[0].total_item,
        };
      return {};
    } catch (error) {
      console.log("getReviewByBlog error >>>> ", error);
      return {};
    }
  },

  createBlogReview: async (user_id, review, blog_id, status) => {
    try {
      const insertRes = await mysql.query(
        `INSERT INTO blog_review(review_date, user_id, review, blog_id, status) VALUES(Now(), ${Number(
          user_id
        )}, '${review}', ${Number(blog_id)}, ${status})`
      );
      return insertRes ? true : false;
    } catch (error) {
      console.log("createBlogReview error >>>> ", error);
      return false;
    }
  },

  getUserBlogFavourite: async (userId, blogId) => {
    try {
      const userFavourite = await mysql.query(
        `SELECT * FROM blog_favourite WHERE blog_id=${Number(
          blogId
        )} AND user_id=${Number(userId)}`
      );
      return userFavourite?.length ? true : false;
    } catch (error) {
      console.log("getUserBlogFavourite error >>>> ", error);
      return false;
    }
  },

  changeUserFavouriteBlog: async (userId, blogId, status) => {
    try {
      if (status) {
        const changeRes = await mysql.query(
          `INSERT INTO blog_favourite(user_id, blog_id) VALUES(${Number(
            userId
          )}, ${Number(blogId)})`
        );
        return changeRes ? true : false;
      }

      const deleteRes = await mysql.query(
        `DELETE FROM blog_favourite WHERE blog_id=${Number(
          blogId
        )} AND user_id=${Number(userId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      console.log("changeUserFavouriteBlog error >>>> ", error);
      return false;
    }
  },

  getAllRelativeBlog: async (limit, offset, existBlog) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const getQuery = await mysql.query(
        `SELECT _id, blog_title, blog_desc, blog_image, create_at, 
        (SELECT COUNT(br._id) FROM blog_review br WHERE br.blog_id = blog._id ) AS count_review,
        (SELECT COUNT(bf.user_id) FROM blog_favourite bf WHERE bf.blog_id = blog._id ) AS count_favourite
        FROM blog WHERE _id != ${Number(
          existBlog
        )} ORDER BY create_at DESC ${limitOffset}`
      );
      return getQuery || [];
    } catch (error) {
      console.log("getAllRelativeBlog error >>>> ", error);
      return [];
    }
  },

  changeBlogView: async (blogId, view) => {
    try {
      const response = await mysql.query(
        `UPDATE blog SET blog_view=${Number(view)} WHERE _id=${Number(blogId)}`
      );
      return response ? true : false;
    } catch (error) {
      console.log("changeBlogView error >>>> ", error);
      return false;
    }
  },
};
