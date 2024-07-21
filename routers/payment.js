const express = require("express");
const paymenController = require("../controllers/payment");
const router = express.Router();

router.post("/zaloPayment", paymenController.payment);
router.post("/zaloPayCallback", paymenController.paymentCallBackpayment);
router.post("/checktstus-order", paymenController.checkStatusOrder);

module.exports = router;
