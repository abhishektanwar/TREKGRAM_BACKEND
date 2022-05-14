const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = require("express").Router();
const {updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser} = require('../controllers/userController');
const {protect} = require('../middleware/authMiddleware');

// router.get("/", (req, res) => {
//   res.send("hey it is user route");
// });

// // update user
// router.put("/:id", async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try{
//       const user = await User.findByIdAndUpdate(req.body.userId,{$set:req.body});
//       res.status(200).json("Account has been updated")
//     }
//     catch(err){
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account!");
//   }
// });

// // delete user
// router.delete("/:id",async (req,res)=>{
//   if(req.body.userId === req.params.id || req.body.isAdmin){
//     try{
//       const user = await User.findByIdAndDelete(req.params.id)
//       res.status(200).json("Account has been deleted");
//     }
//     catch(err){
//       console.log("err",err)
//       return res.status(500).json(err);
//     }
//   }
//   else{
//     return res.status(403).json("You can only delete your own account!");
//   }
// })

// // get a user
// router.get("/:id",async(req,res)=>{
//   try{
//     const user = await User.findById(req.params.id)
//     const {password,updatedAt,...other} = user._doc
//     res.status(200).json(other)
//   }
//   catch(err){
//     res.status(500).json(err)
//   }
// })
// // follow a user
// router.put('/:idToFollow/follow',async(req,res)=>{
//   if(req.body.userId !== req.params.idToFollow){
//     try{
//       // current user is trying to follow user
//       const user = await User.findById(req.params.idToFollow);
//       const currentUser = await User.findById(req.body.userId);
//       if(!user.followers.includes(req.body.userId)){
//         // add current user to followers of user
//         await user.updateOne({$push:{followers:req.body.userId}})
//         // add user to following of current User
//         await currentUser.updateOne({$push:{following:req.params.idToFollow}})
//         res.status(200).json("User has been followed")
//       }else{
//         res.status(403).json("You already follow this user")
//       }
//     }
//     catch(err){
//       res.status(500).json(err)
//     }
//   }
//   else{
//     res.status(403).json("You cannot follow yourself")
//   }
// })

// // unfollow a user
// router.put("/:idToUnfollow/unfollow",async (req,res)=>{
//   if(req.body.userId !== req.params.idToUnfollow ){
//     try{
//       const user = await User.findById(req.params.idToUnfollow)
//       const currentUser = await User.findById(req.body.userId)
//       if(user.followers.includes(req.body.userId)){
//         await user.updateOne({$pull:{followers:req.body.iserId}})
//         await currentUser.updateOne({$pull:{following:req.params.idToUnfollow}})
//         res.status(200).json("user has been unfollowed")
//       }
//       else{
//         res.status(403).json("you do not follow this user")
//       }
//     }
//     catch(err){
//       res.status(500).json(err)
//     }
//   }
//   else{
//     res.status(403).json("You cannot unfollow yourself")
//   }
// })
router.put('/:id',protect,updateUser);
router.delete('/:id',protect,deleteUser);
router.get('/:id',getUser);
router.put('/:idToFollow/follow',protect,followUser);
router.put('/:idToFollow/unfollow',protect,unfollowUser);

module.exports = router;
