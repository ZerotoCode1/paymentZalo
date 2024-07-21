const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  getAllCategory: async (limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const categoryData = await mysql.query(
        `SELECT c.* FROM category c ORDER BY _id DESC ${limitOffset}`
      );
      return categoryData || [];
    } catch (error) {
      console.log("getAllCategory error >>>> ", error);
      return [];
    }
  },

  getTotalCategory: async () => {
    try {
      const total = await mysql.query(
        `SELECT COUNT(_id) as count_category FROM category`
      );
      return total?.length ? total?.[0]?.count_category : 0;
    } catch (error) {
      console.log("getTotalCategory error >>>> ", error);
      return 0;
    }
  },

  createCategoryData: async (name, image, category_description) => {
    try {
      const createRes = await mysql.query(
        `INSERT INTO category(category_name, category_description, category_image, created_day) VALUES('${name}', '${category_description}', '${image}', Now())`
      );
      return createRes ? true : false;
    } catch (error) {
      console.log("createCategoryData error >>>> ", error);
      return false;
    }
  },

  updateCategoryData: async (name, image, category_description, categoryId) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE category SET category_name='${name}', category_description='${category_description}', category_image='${image}' WHERE _id=${Number(
          categoryId
        )}`
      );
      return updateRes ? true : false;
    } catch (error) {
      console.log("updateCategoryData error >>>> ", error);
      return false;
    }
  },

  deleteCategoryData: async (categoryId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM category WHERE _id=${Number(categoryId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      console.log("deleteCategoryData error >>>> ", error);
      return false;
    }
  },
};
