import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import expressasynchandler from "express-async-handler" 
import { generateToken, isAdmin, isAuth } from "../utils.js";



const userRouter = express.Router();


userRouter.get("/admin", isAuth, isAdmin, expressasynchandler(async(req, res)=>{
    const users = await User.find();
    res.send(users)
}))

userRouter.post("/signin", expressasynchandler(async(req, res)=>{
    const {email, password} = req.body;
    const findUser = await User.findOne({email : email})
    if(findUser){
        if (bcrypt.compareSync(password, findUser.password)){
            const { _id, name, email: fEmail, isAdmin} = findUser
        res.status(200).send({
            _id,
            name,
            email: fEmail,
            isAdmin,
            token: generateToken(findUser)
        })} else{
            res.status(401).send({message : "Incorrect email or password"})
        }
        return;
    }
    res.status(401).send({message : "Incorrect email or password"})
}))


userRouter.get("/", isAuth, isAdmin, expressasynchandler(async(req, res)=>{
    const users = await User.aggregate([{
        $project: {
            name: 1, email: 1, isAdmin: 1
        }
    }])
    if (users) {
        res.send(users)
    } else {
        res.status(401).send({message: "Users cannot be found"})
    }
}))


userRouter.delete("/:id", isAuth, isAdmin, expressasynchandler(async (req, res)=>{
    const {id} = req.params
    const user = User.findById(id)
    if (user) {
        // console.log(user)
        if (user.isAdmin){
            res.status(400).send({ message: 'Can Not Delete Admin User' });
            return;
        }else{
            await user.remove()
            res.send({ message: 'User Deleted' });
        }
    } else {
        res.status(401).send({message: "User not found"})
    }
}))


userRouter.post("/register", expressasynchandler(async(req, res)=>{
    const {email, password, name} = req.body;
    const newUser = new User({
        email,
        password: bcrypt.hashSync(password),
        name
    })
    const user = await newUser.save()
    res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    })} 
))



userRouter.get("/admin/user/:id", isAuth, isAdmin, expressasynchandler(async(req, res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    if (user) {
        res.send(user);
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
}))


userRouter.put("/admin/user/:id", isAuth, isAdmin, expressasynchandler(async(req, res)=>{
    const {id} = req.params
    const user = await User.findById(id)
    if (user) {
        const {name, email, isAdmin} = req.body
        user.name = name;
        user.email = email;
        user.isAdmin = Boolean(isAdmin);
        const updatedUser = await user.save()
        res.status(201).send({message: "User update successful",  user: updatedUser})
      } else {
        res.status(404).send({ message: 'User Not Found' });
      }
}))


userRouter.put("/profile", isAuth, expressasynchandler(async(req, res)=>{
    const { password, newPassword, name, email} = req.body
    const user = await User.findById(req.user._id);
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            user.name = name || user.name;
            user.email= email || user.email;
            if (newPassword){
                user.password = bcrypt.hashSync(newPassword, 8)
            }
            const updatedUser = await user.save()   
            res.send({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                token: generateToken(updatedUser)
            })
        } else {
         res.status(401).send({message: "Old password is incorrect"})   
        }
    } else {
        res.status(401).send({message: "User not found"})
    }
}))

export default userRouter;