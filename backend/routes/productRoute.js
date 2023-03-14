import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { isAdmin, isAuth } from "../utils.js";

const productRouter = express.Router();

productRouter.get('/featuredproduct', async(req, res)=>{
    const products = await Product.find();
    res.send(products);
})


productRouter.get('/categories', expressAsyncHandler(async (req, res)=>{
    const categories = await Product.find().distinct('category')
    // console.log(categories)
    res.send(categories)
}))

productRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const newProduct = new Product({
        name: 'sample name ' + Date.now(),
        // slug: 'sample-name-' + Date.now(),
        img: '/images/p1.jpg',
        price: 0,
        category: 'sample category',
        brand: 'sample brand',
        inStock: 0,
        ratings: 0,
        numReviews: 0,
        description: 'sample description',
      });
      const product = await newProduct.save();
      res.send({ message: 'Product Created', product });
}))



const PAGE_SIZE = 4 ;


const productListSize = 10
productRouter.get('/admin', isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || productListSize;

    const products = await Product.find()
    .skip(pageSize * (page - 1))
    .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts / pageSize)
    })
}))



productRouter.get('/search', expressAsyncHandler(async (req, res)=>{
    const {query} = req
    const category = query.category || ``;
    const price = query.price || ``;
    const rating = query.rating || ``;
    const order = query.order || ``;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const brand = query.brand || "";
    const searchQuery = query.query || ``;

// learning begins
    const queryFilter = 
    searchQuery && searchQuery !== `all` ? {
        name: {
            $regex: searchQuery,
            $options: `i`,
        },
    } : {};
    const categoryFilter = 
    category && category !== `all` ? {
        category
    } : {};
    const ratingFilter =
    rating && rating !== `all` ? {
    ratings: {
        $gte: Number(rating),
    },
} : {};
    const priceFilter = price && price !== `all`
    ? {
        price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
        }
    } : {};

    const sortOrder =
        order === 'featured'
          ? { featured: -1 }
          : order === 'lowest'
          ? { price: 1 }
          : order === 'highest'
          ? { price: -1 }
          : order === 'toprated'
          ? { ratings: -1 }
          : order === 'newest'
          ? { createdAt: -1 }
          : { _id: -1 };

          const products = await Product.find({
            ...queryFilter,
            ...categoryFilter,
            ...priceFilter,
            ...ratingFilter,
          })
            .sort(sortOrder)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
            const countProducts = await Product.countDocuments({
                ...queryFilter,
                ...categoryFilter,
                ...priceFilter,
                ...ratingFilter,
              });
            //   console.log(products)
              res.send({
                products,
                countProducts,
                page,
                pages: Math.ceil(countProducts / pageSize),
              });
}))



productRouter.get("/allproducts", async (req, res)=>{
    const products = await Product.find();
    res.send(products);
})
productRouter.get("/admin/product/:id", isAuth, isAdmin, expressAsyncHandler(async (req, res)=>{
    const { id } = req.params
    const product = await Product.findOne({_id : id})
    // console.log(product)
    if(product){
        res.send(product);
    } else{
        res.status(404).send({message: "Sorry, Product does not exist"})
    }
}))
productRouter.get("/product/:id", async (req, res)=>{
    const { id } = req.params
    const product = await Product.findOne({_id : id})
    // console.log(product)
    if(product){
        res.send(product);
    } else{
        res.status(404).send({message: "Sorry, Product does not exist"})
    }
    
})

productRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id);
      if (product) {
        await product.remove();
        res.send({ message: 'Product Deleted' });
      } else {
        res.status(404).send({ message: 'Product Not Found' });
      }
    })
  );
productRouter.put("/product/:id", isAuth, isAdmin, expressAsyncHandler( async (req, res)=>{
    const {id} = req.params
    const {name, price, description, img, inStock, category} = req.body;
    const product = await Product.findById(id)
    if (product){
        product.name = name;
        product.img = img;
        product.inStock = inStock;
        // product.ratings = ratings;
        product.price = price;
        product.category = category;
        product.description = description;
        await product.save()
        res.send({message : "Product Updated"})
    }else{
        res.status(401).send({message: "Product not found"})
    }
}))



productRouter.get("/produc/:id", async (req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    // console.log(product)
    if (product){
        res.send(product)
    } else{
        res.status(404).send({ message: "Product does not exist"})
    }
})
export default productRouter;
