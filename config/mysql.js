const mysql = require("mysql");

MYSQL_USER = "root";
MYSQL_HOST = "localhost";
MYSQL_DB = "cosmetics_web";
MYSQL_PWD = "";
MYSQL_PORT = "3306";

const mysqlConfig = {
  host: MYSQL_HOST,
  user: MYSQL_USER,
  port: MYSQL_PORT,
  password: MYSQL_PWD,
  database: MYSQL_DB,
};

const pool = mysql.createPool({ ...mysqlConfig, charset: "utf8" });

/**
 *
 * @param {String} queryStr
 * @returns Object
 */

const query = async (queryStr) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      console.log('err >> ', err);
      connection.query(queryStr, function (err, rows) {
        console.log('err 2 >> ', err);
        connection.release();
        return resolve(rows);
      });
    });
  });
};

module.exports.mysql = {
  query,
};
