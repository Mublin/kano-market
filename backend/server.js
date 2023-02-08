import express from "express"
import { data } from "./data.js"
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/ProductRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRouter from "./routes/orderRoute.js";
import uploadRouter from "./routes/uploadRoute.js";
import { isAuth } from "./utils.js";

dotenv.config();
mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log ("connected to db")
}).catch((error)=> {
    console.log(error.message)
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.get("/api/keys/paypal", isAuth, (req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || "sb")
})
app.use("/api/upload", uploadRouter)
app.use("/api/seed", seedRouter)
app.use("/api", productRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)
app.use((err, req, res, next)=>{
    res.status(500).send({message: err.message})
})


app.use((err, req, res, next)=>{
    res.status(500).send({message: err.message})
})

app.listen(process.env.PORT, ()=>{
    console.log(`Aliyu is happy at port ${process.env.PORT}`)
})