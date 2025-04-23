const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoUrl skills about"
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status : "interested"
    }).populate("fromUserId",["firstName","lastName"]);
    res.json({message : "Data Fetched Successfully", data : connectionRequest})
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
      const loggedInUser = req.user;
      const connectionRequest = await ConnectionRequestModel.find({
        $or:[
            {
                toUserId : loggedInUser._id,status: "accepted"
            },
            {
                fromUserId : loggedInUser._id,status: "accepted"
            }
        ]
      }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA)
      const data = connectionRequest.map((row)=>{
        if(row.fromUserId.toString() == loggedInUser._id.toString())
        {
           return row.toUserId;
        }
       return row.fromUserId})
      res.json({message : "Data Fetched Successfully", data})
    } catch (err) {
      res.status(400).send("Error " + err);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequest = await ConnectionRequestModel.find({
      $or:[
          {
              toUserId : loggedInUser._id
          },
          {
              fromUserId : loggedInUser._id
          }
      ]
    }).select("fromUserId toUserId")

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) =>{
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    })
    const users = await UserModel.find({
      $and : [
      {_id : {$nin : Array.from(hideUsersFromFeed)}},
      {_id : {$ne:loggedInUser._id}}
      ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)
    res.json({message : "Data Fetched Successfully", users})
  } catch (err) {
    res.status(400).send("Error " + err);
  }
});

module.exports = userRouter;
