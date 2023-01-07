import express from "express";
import { data } from "../data.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const seedRouter = express.Router();

seedRouter.get('/', async (req, res)=>{
    await Product.deleteMany({})
    const createdProducts = await Product.insertMany(data.products[1].productss)
    res.send({createdProducts})
})
seedRouter.get('/users', async(req, res)=>{
    await User.deleteMany({})
    const createdUsers = await User.insertMany(data.users)
    res.send({createdUsers})
})
export default seedRouter;