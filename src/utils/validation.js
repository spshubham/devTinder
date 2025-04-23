const validator = require("validator")
const validateSignUpData = (req) => {
    const {firstName,lastName,emailId,password} = req.body;

    if(!firstName || !lastName)
    {
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId))
    {
        throw new Error("EmailId is not valid")
    }
    else if(!validator.isStrongPassword(password))
    {
        throw new Error("Password is not valid")
    }
    else if(firstName.length<4 || firstName.length>50)
    {
        throw new Error("First Name Should be 4-50 chars")
    }
}


const validateEditProfileData = (req) => {
    const allowedEdits = ["firstName","lastName","gender","skills","emailId","age","about","photoUrl"];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEdits.includes(field));
    
    return isEditAllowed;
}
module.exports = {validateSignUpData, validateEditProfileData}