const express = require("express");
const app = express();
const connectDB = require("./config/database");
app.use(express.json());
const User = require("./models/user");
// app.use((req, res,next) => {
//   console.log("1st req")
//   res.send("Hello from Server");
//   next();
// },
// (req,res)=>{
//     console.log("2nd req")
//     res.send("2nd response")
// });

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error while creating user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length) res.send(users);
    else res.status(404).send("User not found");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length) res.send(users);
    else res.status(404).send("User not found");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    res.send("users deleted ");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const data = req.body;
  const userId = req.params?.userId;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if(data?.skills.length>9)
    {
      throw new Error("Skills can not be more than 9")
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
      returnDocument: "after",
    });
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(400).send("Error while creating user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB Connection is successful");
    app.listen(3000, () => {
      console.log("Server is running of PORT : 3000");
    });
  })
  .catch(() => {
    console.log("DB Error");
  });
