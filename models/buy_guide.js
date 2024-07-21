const { mysql } = require("../config/mysql");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  getAllBuyGuide: async (status, limit, offset) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const buyGuideData = await mysql.query(
        `SELECT bg.* FROM buy_guide bg WHERE ${Number(status) !== -1 ? `bg.status=${Number(status)}` : `bg.status != -1` } ORDER BY _id DESC ${limitOffset}`
      );
      return buyGuideData || [];
    } catch (error) {
      console.log("getAllBuyGuide error >>>> ", error);
      return [];
    }
  },

  getTotalBuyGuide: async (status) => {
    try {
      const total = await mysql.query(
        `SELECT COUNT(_id) as count FROM buy_guide WHERE ${Number(status) !== -1 ? `status=${Number(status)}` : `status != -1` }`
      );
      return total?.length ? total?.[0]?.count : 0;
    } catch (error) {
      console.log("getTotalBuyGuide error >>>> ", error);
      return 0;
    }
  },

  createBuyGuideData: async (title, guide_description) => {
    try {
      const createRes = await mysql.query(
        `INSERT INTO buy_guide(title, guide_description, created_day, status) VALUES('${title}', '${guide_description}', Now(), 0)`
      );
      return createRes ? true : false;
    } catch (error) {
      console.log("createBuyGuideData error >>>> ", error);
      return false;
    }
  },

  updateGuideData: async (title, guide_description, guideId) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE buy_guide SET title='${title}', guide_description='${guide_description}' WHERE _id=${Number(
          guideId
        )}`
      );
      return updateRes ? true : false;
    } catch (error) {
      console.log("updateGuideData error >>>> ", error);
      return false;
    }
  },

  deleteGuideData: async (guideId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM buy_guide WHERE _id=${Number(guideId)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      console.log("deleteGuideData error >>>> ", error);
      return false;
    }
  },

  changeGuideActive: async (guidId) => {
    try {
      await mysql.query(`UPDATE buy_guide SET status=0 WHERE _id > 0`);
      const res = await mysql.query(`UPDATE buy_guide SET status=1 WHERE _id = ${Number(guidId)}`)
      return res ? true : false;
      
    } catch (error) {
      console.log("changeGuideStatus error >>>> ", error);
      return false;
    }
  },

  changeGuideInActive: async (guidId) => {
    try {
      const res = await mysql.query(`UPDATE buy_guide SET status=0 WHERE _id = ${Number(guidId)}`)
      return res ? true : false;
      
    } catch (error) {
      console.log("changeGuideInActive error >>>> ", error);
      return false;
    }
  }
};
