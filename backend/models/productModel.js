import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    name:{ type: String, required: true,},
    img:{ type: String, required: true,},
    price:{ type: Number, required: true,},
    inStock:{ type: Number, required: true,},
    ratings:{ type: Number, required: true,},
    category:{ type: String, required: false,},
},
{
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)

export default Product