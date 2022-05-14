const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const asyncHandler = require('express-async-handler')

const createPost = asyncHandler(async(req,res)=>{
  const newPost = new Post(req.body);

  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
})

const updatePost = asyncHandler(async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post has been updated");
    } else {
      res.status(403).json("You can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

const deletePost = asyncHandler(async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post has been deleted successfully");
    } else {
      res.status(403).json("You can only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

const likeDislikePost = asyncHandler(async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

const getPost = asyncHandler(async(req,res)=>{
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json("Requested post does not exist");
    } else {
      res.status(200).json(post);
    }
  } catch (err) {
    res.status(500).json(err);
  }
})

const getTimelinePost = asyncHandler(async(req,res)=>{
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    // use promise.all when using a loop to fetch data
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = {
  createPost,
  updatePost,
  deletePost,
  likeDislikePost,
  getPost,
  getTimelinePost
}