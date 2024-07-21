const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  payMomo: async (limit, offset) => {
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
};
