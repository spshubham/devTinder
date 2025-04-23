const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      index:true,
      required : true,
      minLength : 3,
      maxLength : 50,

    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase : true,
      required : true,
      unique : true,
      trim : true,
      validate(value)
      {
        if(!validator.isEmail(value))
        {
            throw new Error("Invalid Email Address");
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(value)
      {
        if(!validator.isStrongPassword(value))
        {
            throw new Error("Enter Strong Password"+value);
        }
      }
    },
    age: {
      type: Number,
      age : 18,

    },
    gender: {
      type: String,
      validate(value)
      {
        if(!['male','female','others'].includes(value))
        {
            throw new Error("Gender Data Invalid"+value);
        }
      }
    },
    photoUrl: {
        type: String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiibOngFYog5Ri5UoFKH3CsHMOvomBLf4JAw&s",
        validate(value)
      {
        if(!validator.isURL(value))
        {
            throw new Error("Invalid URL Address"+value);
        }
      }
    },
    about: {
        type: String,
        default : "this is default info"
    },
    skills: {
        type: [String],
    },
  },
  { timestamps: true }
);

userSchema.index({skills : 1})
userSchema.methods.getJWT = async function(){
  const user = this;
  const token =  await jwt.sign({_id : user._id}, "SP@DEV$90",{expiresIn:"7d"})
  return token;
}
userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user = this;
  const passwordHash = user.password
  const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash)
  return isPasswordValid;
}
module.exports = mongoose.model("User", userSchema);
