const { mysql } = require("../config/mysql");
const bcrypt = require("bcrypt");
const { getByLimitAndOffset } = require("../utils/helpers");

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await mysql.query(
        `SELECT _id, first_name, last_name, email, password, status, created_day, phone_number, address FROM users WHERE email='${email}'`
      );
      if (user?.length) {
        return user?.[0];
      }
      return {};
    } catch (error) {
      console.log("get user by email error >>>> ", error);
      return {};
    }
  },

  getAdminByEmail: async (email) => {
    try {
      const admins = await mysql.query(
        `SELECT _id, first_name, last_name, email, password, status, created_day, phone_number, address FROM admins WHERE email='${email}'`
      );
      if (admins?.length) {
        return admins?.[0];
      }
      return {};
    } catch (error) {
      console.log("get admins by email error >>>> ", error);
      return {};
    }
  },

  getUserList: async (limit, offset, search) => {
    try {
      const limitOffset = getByLimitAndOffset(limit, offset);
      const userList = await mysql.query(
        `SELECT ur._id, ur.first_name, ur.last_name, ur.email, ur.status, ur.created_day, ur.phone_number, ur.address
        FROM users ur WHERE ${
          search && search !== "undefined"
            ? `ur.first_name LIKE '%${search}%' OR ur.last_name LIKE '%${search}%'`
            : `ur._id != 0`
        }  ORDER BY ur._id DESC ${limitOffset}`
      );

      return userList || [];
    } catch (error) {
      console.log("get user list error >>>> ", error);
      return [];
    }
  },

  countTotalUser: async (search) => {
    try {
      const count = await mysql.query(
        `SELECT COUNT(_id) as count_user FROM users WHERE ${
          search && search !== "undefined"
            ? `users.first_name LIKE '%${search}%' OR users.last_name LIKE '%${search}%'`
            : `users._id != 0`
        }`
      );
      return count?.[0]?.count_user || 0;
    } catch (error) {
      console.log("countTotalUser error >>>> ", error);
      return 0;
    }
  },

  getUserById: async (userId) => {
    try {
      const userInfo = await mysql.query(
        `SELECT ur._id, ur.first_name, ur.last_name, ur.email, ur.status, ur.created_day, ur.phone_number, ur.address
        FROM users ur WHERE ur._id = ${Number(userId)}`
      );

      return userInfo?.[0] || {};
    } catch (error) {
      console.log("getUserById error >>>> ", error);
      return {};
    }
  },

  getAdminList: async (search) => {
    try {
      const adminList = await mysql.query(
        `SELECT _id, first_name, last_name, email, status, created_day, phone_number, address FROM admins WHERE ${
          search && search !== "undefined"
            ? `admins.first_name LIKE '%${search}%' OR admins.last_name LIKE '%${search}%'`
            : `admins._id != 0`
        }`
      );
      return adminList || [];
    } catch (error) {
      console.log("get admins list error >>>> ", error);
      return [];
    }
  },

  deleteUserInfo: async (_id) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM users WHERE _id=${Number(_id)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      console.log("delete user info error >>>> ", error);
      return false;
    }
  },

  deleteAdminInfo: async (_id) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM admins WHERE _id=${Number(_id)}`
      );
      return deleteRes ? true : false;
    } catch (error) {
      console.log("delete admins info error >>>> ", error);
      return false;
    }
  },

  updateUserStatus: async (_id, status) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE users SET status=${Number(status)} WHERE _id=${Number(_id)}`
      );
      return updateRes ? true : false;
    } catch (error) {
      console.log("update user info error >>>> ", error);
      return false;
    }
  },

  updateAdminStatus: async (_id, status) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE admins SET status=${Number(status)} WHERE _id=${Number(_id)}`
      );

      return updateRes ? true : false;
    } catch (error) {
      console.log("update admins info error >>>> ", error);
      return false;
    }
  },

  countUser: async (fromDate, toDate) => {
    try {
      const userQuantity = await mysql.query(
        `SELECT COUNT(_id) AS user_quantity FROM users WHERE ${
          fromDate !== "undefined"
            ? `date(created_day) >= date('${fromDate}')`
            : "created_day is not null"
        } AND 
        ${
          toDate !== "undefined"
            ? `date(created_day) <= date('${toDate}')`
            : "created_day is not null"
        }`
      );
      return userQuantity?.[0]?.user_quantity || 0;
    } catch (error) {
      console.log("countUser error >>>> ", error);
      return 0;
    }
  },

  createNewUser: async (
    firstName,
    lastName,
    email,
    password,
    status,
    phone_number,
    address,
    type
  ) => {
    try {
      if (type === "user") {
        const hash = bcrypt.hashSync(password, 10);
        const signupRes = await mysql.query(
          `INSERT INTO users(first_name, last_name, email, password, created_day, status, phone_number, address) VALUES('${firstName}', '${lastName}', '${email}', '${hash}', Now(), ${Number(
            status
          )}, '${phone_number ? phone_number : ""}', '${
            address ? address : ""
          }')`
        );
        if (signupRes) return true;
      }

      if (type === "admin") {
        const hash = bcrypt.hashSync(password, 10);
        const signupRes = await mysql.query(
          `INSERT INTO admins(first_name, last_name, email, password, created_day, status, phone_number, address) VALUES('${firstName}', '${lastName}', '${email}', '${hash}', Now(), ${Number(
            status
          )}, '${phone_number ? phone_number : ""}', '${
            address ? address : ""
          }')`
        );
        if (signupRes) return true;
      }
      return false;
    } catch (error) {
      console.log("user sign up error >>>> ", error);
      return false;
    }
  },

  updateUserInfo: async (
    id,
    email,
    first_name,
    last_name,
    address,
    phone_number
  ) => {
    try {
      const updateRes = await mysql.query(
        `UPDATE users SET first_name='${first_name}', last_name='${last_name}', address='${address}', phone_number='${phone_number}', email='${email}' WHERE _id=${Number(
          id
        )}`
      );
      if (updateRes) return true;
      return false;
    } catch (error) {
      console.log("updateUserInfo error >>>> ", error);
      return false;
    }
  },
};
