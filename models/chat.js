const { mysql } = require("../config/mysql");

const ChatModel = {
  getUserChatMessage: async (user_id) => {
    try {
      const user_chat =
        await mysql.query(`SELECT ucr.user_id as clientId, ucr.message AS replyMessage, ucr.created_day as chatDate, urr.last_name as adLastName, urr.first_name as adFirstName  
      FROM  user_chat ucr
      LEFT JOIN users urr ON ucr.user_id = urr._id
      WHERE ucr.user_id=${Number(user_id)} AND ucr.owner_reply is null ORDER BY ucr.created_day ASC`);

      const userReply =
        await mysql.query(`SELECT ucr.user_id as clientId, ucr.owner_reply as ownerId, ucr.message AS replyMessage, ucr.created_day as chatDate, ad.last_name as adLastName  , ad.first_name as adFirstName
      FROM  user_chat ucr
      LEFT JOIN admins ad ON ucr.owner_reply = ad._id
      WHERE ucr.owner_reply is not null AND ucr.user_id=${Number(user_id)} ORDER BY ucr.created_day ASC`);

      const allChat = (user_chat ?? []).concat(userReply ?? [])
      allChat.sort(function (x, y) {
        return x.chatDate - y.chatDate;
      });
      return allChat || [];
    } catch (error) {
      console.log("getUserChatMessage error >>>> ", error);
      return [];
    }
  },

  createUserChat: async (user_id, message) => {
    try {
      const res = await mysql.query(
        `INSERT INTO user_chat(user_id, message, created_day, status) VALUES(${Number(
          user_id
        )}, '${message}', Now(), 0)`
      );
      return res ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  createUserChatReply: async (user_id, message, owner_reply) => {
    try {
      const res = await mysql.query(
        `INSERT INTO user_chat(user_id, owner_reply, message, created_day) VALUES(${Number(
          user_id
        )}, ${Number(owner_reply)},'${message}', Now())`
      );
      await mysql.query(`UPDATE user_chat SET status=1 WHERE user_id=${user_id}`);
      return res ? true : false;
    } catch (error) {
      console.log("createUserChat error >>>> ", error);
      return false;
    }
  },

  getAllUserHaveChat: async () => {
    try {
      const response = await mysql.query(
        `SELECT ur._id, ur.last_name as adLastName, ur.first_name as adFirstName,
        (SELECT COUNT(*) from user_chat where user_chat.user_id = ur._id AND user_chat.status = 0 AND user_chat.owner_reply is null) as totalUnRead, 
        (SELECT user_chat.created_day from user_chat where user_chat.user_id = ur._id ORDER BY user_chat.created_day DESC LIMIT 1) as newCreatedMessage 
        FROM user_chat uc JOIN users ur ON uc.user_id = ur._id GROUP BY ur._id`
      );
      const allUser = [];
      if (response) allUser?.push(...response);

      allUser?.sort(function (x, y) {
        return new Date(y.newCreatedMessage) - new Date(x.newCreatedMessage);
      });

      const obj = {};
      for (const item of allUser) {
        if (!obj[item._id]?._id) {
          obj[item._id] = item;
        }
      }

      const output = Object.values(obj);
      output?.sort(function (x, y) {
        return new Date(y.newCreatedMessage) - new Date(x.newCreatedMessage);
      });

      return output || [];
    } catch (error) {
      console.log("getAllUserHaveChat error >>>> ", error);
      return [];
    }
  },

  updateReadMessage: async (user_id) => {
    try {
      const res = await mysql.query(`UPDATE user_chat SET status=1 WHERE user_id=${user_id}`);

      return res ? true : false;
    } catch (error) {
      console.log("updateReadMessage error >>>> ", error);
      return false;
    }
  },
};

module.exports = ChatModel;
