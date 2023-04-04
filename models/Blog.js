const mongoose=require("mongoose");

const blogschema=new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    }
    
    ,description:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        require: [true, "user id is required"],
      }
      ,
     topic:{
        type:String,
        required:true
     }

        


      
})

const blogmodel=mongoose.model('Blog',blogschema);
module.exports=blogmodel;