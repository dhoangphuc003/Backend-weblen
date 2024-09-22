const express = require("express");
const router = express.Router()
const OrderController = require('../controller/OrderController');
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post('/create/:id', authUserMiddleware, OrderController.createOrder)
router.get('/get-all-order/:id',authUserMiddleware, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id',authUserMiddleware, OrderController.cancelOrderDetails)
router.get('/get-all-order',authMiddleware, OrderController.getAllOrder)
router.put('/update/:id',authUserMiddleware, OrderController.updateOrder)


module.exports = router