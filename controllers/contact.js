const asyncHandler = require("express-async-handler");
const { getAllContact, createContactData, updateContactData, deleteContactData } = require("../models/contact");

module.exports = {
  getAllContact: asyncHandler(async (req, res) => {
    const contactList = await getAllContact();
    res.send({ success: true, payload: contactList });
  }),

  createNewContact: asyncHandler(async (req, res) => {
    const {contactData} = req.body
    const {customer_name, customer_email, customer_phone, contact_subject, contact_description} = contactData
    const createRes = await createContactData(customer_name, customer_email, customer_phone, contact_subject, contact_description)
    res.send({ success: createRes });
  }),

  deleteContactData: asyncHandler(async (req, res) => {
    const {contactId} = req.params
    const deleteRes = await deleteContactData(contactId)
    res.send({ success: deleteRes });
  })
};
