const { mysql } = require("../config/mysql");

module.exports = {
  getAllContact: async () => {
    try {
      const contactData = await mysql.query(`SELECT * FROM contact ORDER BY created_day DESC`);
      if (contactData) {
        return contactData;
      }
      return [];
    } catch (error) {
      console.log("getAllHelper error >>>> ", error);
      return [];
    }
  },

  createContactData: async (
    customer_name,
    customer_email,
    customer_phone,
    contact_subject,
    contact_description
  ) => {
    try {
      const createRes = await mysql.query(
        `INSERT INTO contact(customer_name, customer_email, customer_phone, contact_subject, contact_description, created_day) 
        VALUES('${customer_name}', '${customer_email}', '${customer_phone}', '${contact_subject}', '${contact_description}', Now())`
      );
      if (createRes) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("createContactData error >>>> ", error);
      return false;
    }
  },

  deleteContactData: async (contactId) => {
    try {
      const deleteRes = await mysql.query(
        `DELETE FROM contact WHERE _id=${Number(contactId)}`
      );
      if (deleteRes) {
        return true;
      }
      return false;
    } catch (error) {
      console.log("deleteContactData error >>>> ", error);
      return false;
    }
  },
};
