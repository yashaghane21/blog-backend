const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8080



//env config
dotenv.config();




//rest objecct
const app = express();

//middelwares
app.use(cors({
    origin:"*"
}));
app.use(express.json());
app.use(morgan("dev"));


const userroutes = require("./Routers/users");
const blogroutes = require("./Routers/blogs");


mongoose.set('strictQuery', false);
var mongoDB = mongoose.set('strictQuery', false);
var mongoDB = "mongodb+srv://bytedevs2121:FoUR3y9ie4PKPjU2@cluster0.oaifhaa.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("coonection succsess");
}).catch((e) => {
    console.log(e);
})



mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("coonection succsess");
}).catch((e) => {
    console.log(e);
})




app.use("/api/v1/users", userroutes);
app.use("/api/v1/blogs", blogroutes);


app.listen(PORT, () => {
    console.log("serve is running"
    );
});