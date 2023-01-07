import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import { generateToken, isAdmin, isAuth } from "../utils.js";
import Product from "../models/productModel.js";


const orderRouter = express.Router()
orderRouter.post("/", isAuth, expressAsyncHandler(async (req, res)=>{
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    // console.log(orderItems)
    const newOrder = new Order({
        orderItems: orderItems.map((x)=> ({...x, product: x._id})),
        shippingAddress,
        shippingPrice,
        paymentMethod,
        itemsPrice,
        taxPrice,
        totalPrice,
        user: req.user._id
    })
    const order = await newOrder.save();
    res.status(201).send({message: "New Order Created", order})
}))

orderRouter.get("/mine", isAuth, expressAsyncHandler(async (req, res)=>{
    const orders = await Order.find({ user: req.user._id})
    // console.log(orders)
    res.send(orders)
}))




const orderListSize = 5
orderRouter.get('/admin', isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || orderListSize;

    const orders = await Order.find().populate("user", "name")
    .skip(pageSize * (page - 1))
    .limit(pageSize);
    const countOrders = await Order.countDocuments();
    // console.log(orders)
    res.send({
        orders,
        countOrders,
        page,
        pages: Math.ceil(countOrders / pageSize)
    })
}))


orderRouter.delete("/:id", expressAsyncHandler(async (req,res)=>{
    const {id} = req.params;
    const order = await Order.findById(id)
    if (order) {
        await order.remove();
        res.status(201).send({message: "Deleted Successfully"})
    } else {
        res.status(401).send({message : "Order does not exist"})
    }
}))


orderRouter.get("/summary", isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const users = await User.aggregate([{
        $group: {
            _id: null,
            numUser: {$sum: 1}
        }
    }])
    const orders = await Order.aggregate([{
        $group: {
            _id: null,
            numOrders: {$sum : 1},
            totalPrice:{$sum: "$totalPrice"}
        }
    }])
    const productCategories = await Product.aggregate([{
        $group : {

            _id: "$category",
            count: {$sum : 1}
        }
    }])
    const dailyOrders = await Order.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },//result todays date
            orders: { $sum: 1 }, // sum of orders
            sales: { $sum: '$totalPrice' },
          },
        },
        { $sort: { _id: 1 } },
      ]);
    res.send({dailyOrders, orders, users,productCategories})
}))

orderRouter.get("/:id", isAuth, expressAsyncHandler(async (req, res)=>{
    const order = await Order.findById(req.params.id)
    if (order){
        res.send(order)
    }else{
        res.sendStatus(401).send({ message: "Order Not Found"})
    }
}))



orderRouter.put("/:id/pay", isAuth, expressAsyncHandler(async (req, res)=>{
    const {id} = req.params
    const order = await Order.findById(id)
    if (order) {
        const {id, status, update_time, email_address} = req.body
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id,
            status,
            update_time,
            email_address   
        }
        const updatedOrder = await order.save();
        res.send({ message: "Order Paid", order: updatedOrder})
    } else{
        res.status(401).send("Order not found")
    }
}))
export default orderRouter;