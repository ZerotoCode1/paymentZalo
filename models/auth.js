const { mysql } = require("../config/mysql");
const bcrypt = require("bcrypt");

module.exports = {
  userSignUp: async (firstName, lastName, email, password) => {
    try {
      const hash = bcrypt.hashSync(password, 10);
      const signupRes = await mysql.query(
        `INSERT INTO users(first_name, last_name, email, password, created_day, status) VALUES('${firstName}', '${lastName}', '${email}', '${hash}', Now(), 1)`
      );
      if (signupRes) return true;

      return false;
    } catch (error) {
      console.log("user sign up error >>>> ", error);
      return false;
    }
  },
};
