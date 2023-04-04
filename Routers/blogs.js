const express = require("express");
const usermodel = require("../models/User")
const blogModel = require("../models/Blog");
const mongoose = require("mongoose");
const router = express.Router();



                     //create blog --

router.post("/create-blog", async (req, res) => {
    try {
        const { title, description, image, user ,topic} = req.body;
        //validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: "Please Provide ALl Fields",
            });
        }
        const exisitingUser = await usermodel.findById(user);
        //validaton
        if (!exisitingUser) {
            return res.status(404).send({
                success: false,
                message: "unable to find user",
            });
        }

        const newBlog = new blogModel({ title, description, image, user ,topic });
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save({ session });
        exisitingUser.blogs.push(newBlog);
        await exisitingUser.save({ session });
        await session.commitTransaction();

        await newBlog.save();
        return res.status(201).send({
            success: true,
            message: "Blog Created!",
            newBlog,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Error WHile Creting blog",
            error,
        });
    }
}
)




                          //get all blogs 

router.get("/all-blog", async (req, res) => {

    try {

        const allblogs = await blogModel.find({}).populate("user")
        return res.status(200).send({
            success: true,
            message: "all blogs fetched",
            allblogs
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false, message: "not getting"
        })
    }

})

                        //update blogs

router.put("/update-blog/:id", async (req, res) => {

    try {
        const { id } = req.params
        const { title, description, image } = req.body;
        const blog = await blogModel.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true }
        );
        return res.status(200).send({
            success: true,
            message: "updated",
            blog
        })

    } catch (error) {
        console.log(error)
    }
})


                       //get single blog 

router.get("/get-blog/:id", async (req, res) => {

    try {
        const { id } = req.params
        const blog = await blogModel.findById({ id })
        if (!blog) {
            return res.status(400).send({
                success: false,
                message: "blog not found"
            })
        }

        return res.send({
            success: true,
            message: "done",
            blog
        })
    } catch (error) {

    }

})

                // -delete user blog ---

            
router.delete("/delete-blog/:id", async (req, res) => {

    try {
        const blog = await blogModel
            .findByIdAndDelete(req.params.id)
            .populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
        return res.status(200).send({
            success: true,
            message: "Blog Deleted!",
            blog
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: "Erorr WHile Deleteing BLog",
            error,
        });
    }
})


                //------get user blog------
                
router.get("/user-blog/:id", async (req, res) => {


    try {

        const userblog = await usermodel.findById(req.params.id).populate("blogs")
        //validation
        if (!userblog) {
            return res.status(400).send({
                success: false,
                message: "not get log of any user"
            })
        }

        return res.status(200).send({
            success: true,
            message: "get it ",
            userblog
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false, message: "error"
        })


    }



})




module.exports = router;