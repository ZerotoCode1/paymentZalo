const { mysql } = require("../config/mysql");

module.exports = {
  addUserToken: async (user_id, token) => {
    try {
      const response = await mysql.query(
        `INSERT INTO users_token(user_id, refresh_token, created_day) VALUES(${Number(
          user_id
        )}, '${token}', now()) `
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteUserToken: async (user_id) => {
    try {
      const response = await mysql.query(
        `DELETE FROM users_token WHERE user_id=${Number(user_id)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  getTokenByUserId: async (user_id) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM users_token WHERE user_id=${Number(user_id)}`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getToken: async (token) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM users_token WHERE refresh_token='${token}'`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  addAdminToken: async (admin_id, token) => {
    try {
      const response = await mysql.query(
        `INSERT INTO admin_token(admin_id, refresh_token, created_day) VALUES(${Number(
          admin_id
        )}, '${token}', now()) `
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  deleteAdminToken: async (admin_id) => {
    try {
      const response = await mysql.query(
        `DELETE FROM admin_token WHERE admin_id=${Number(admin_id)}`
      );
      return response ? true : false;
    } catch (error) {
      return false;
    }
  },

  getTokenByAdminId: async (admin_id) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM admin_token WHERE admin_id=${Number(admin_id)}`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },

  getAdminToken: async (token) => {
    try {
      const response = await mysql.query(
        `SELECT * FROM admin_token WHERE refresh_token='${token}'`
      );
      return response?.[0] || {};
    } catch (error) {
      return {};
    }
  },
};
