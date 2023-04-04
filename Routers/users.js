const express = require("express");
const usermodel = require("../models/User")
const blogmodel = require("../models/Blog")
const bcrypt = require("bcrypt");

const router = express.Router();




                      // create user bhaicyyy

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)

      return res.status(400).send({
        success: false, message: "all fields required "
      })

    //existing user
    const exuser = await usermodel.findOne({ email })

    if (exuser) {
      return res.status(401).send({
        success: false, message: "user already exist"
      });
    }
    //hashed the password with bcrypt

    const hashedPassword = await bcrypt.hash(password, 10);



                              //user save 
    const user = new usermodel({ username, email, password: hashedPassword,});
    await user.save();
    return res.status(201).send({
      success: true,
      message: "user craeted",
      user
    })


  }
  catch (error) {
    console.log(error)
    return res.status(500).send({
      message: "hii",
      success: false,
      error
    })
  }
}

);




                        //LOGIN || POST



router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "Please provide email or password",
      });
    }
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "email is not registerd",
      });
    }
    //password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        success: false,
        message: "Invlid username or password",
      });
    }
    return res.status(200).send({
      success: true,
      messgae: "login successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Login Callcback",
      error,
    });
  }
}


);








                             //get all users


router.get("/getalluser", async (req, res) => {
  const users = await usermodel.find({})
  res.send({
    success: true,
    users
  })
})







                 //follow following 
router.patch("/follow", async (req, res) => {
  try {
    let whomFollowed = await usermodel.findByIdAndUpdate(
      {

        _id: req.body.followingId         //take id of user who following

      },
      {
        $push: { following: req.body.followerId }
      }
    );


    let whoFollowedMe = await usermodel.findByIdAndUpdate(
      {

        _id: req.body.followerId            // take id of user who followed

      },
      {
        $push: { followers: req.body.followingId }

      }
    )

    return res.status(200).send({
      message: "User Follow Success",
      whoFollowedMe,
      whomFollowed
    });

  } catch (e) {
    return res.status(500).send({ message: "User Follow Failed", data: e.message });
  }
});


 

               //unfollow a user 

router.patch("/unfollow", async (req, res) => {
  try {
    let whomUnFollowed = await usermodel.findByIdAndUpdate(
      {
        _id: req.body.followingId
      },
      {
        $pull: { following: req.body.followerId }
      }
    );
    let whoUnFollowedMe = await usermodel.findByIdAndUpdate(
      {
        _id: req.body.followerId
      },
      {
        $pull: { followers: req.body.followingId }
      }
    )
    return res.status(200).send(
      {
        message: "User UnFollow Success", whomUnFollowed, whoUnFollowedMe
      }

    );
  } catch (e) {
    return res.status(500).send({ message: "User UnFollow Failed", data: e.message });
  }
});





//get a data of person jyala user follow krt ahe 

router.get('/getsubpost/:id', async (req, res) => {
   
  const userfollowingdata = await usermodel.findById(req.params.id).populate("following")

  return res.status(200).send({
    success: true,
    message: "get it ",
    userfollowingdata
  })
})





module.exports = router;