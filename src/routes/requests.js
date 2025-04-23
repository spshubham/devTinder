const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      console.log(fromUserId)
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored"];

      if(!allowedStatus.includes(status))
      {
        return res.status(400).json({message : "Invalid Status "+status});
      }
      const toUser = await UserModel.findById(toUserId);
      if(!toUser)
      {
        return res.status(404).json({message: "User does not exist"})
      }
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or:[
          {fromUserId: fromUserId,toUserId:toUserId},
          {fromUserId : toUserId, toUserId:fromUserId}
        ]
      })
      if(existingConnectionRequest)
      {
        return res.status(400).json({message: "Connection request already present"})
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,toUserId,status
      })
      const data = await connectionRequest.save();
      res.json({
        message : "Connection request sent successfully",
        data
      })
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const requestId = req.params.requestId;
      const status = req.params.status;
      const allowedStatus = ["accepted", "reject ed"];

      if(!allowedStatus.includes(status))
      {
        return res.status(400).json({message : "Invalid Status "+status});
      }
      
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId : loggedInUser._id,
        status : "interested"
      })
      if(!connectionRequest)
      {
        return res.status(404).json({message: "Connection request not found"})
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message : "Connection request "+ status,
        data
      })
    } catch (err) {
      res.status(400).send("Error" + err.message);
    }
  }
);
module.exports = requestRouter;
