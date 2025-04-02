const mongoose = require("mongoose")


const connectDB = async() =>{
   await mongoose.connect("mongodb+srv://sp1234:1234@cluster0.p8sd2qf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

}

module.exports = connectDB; 
