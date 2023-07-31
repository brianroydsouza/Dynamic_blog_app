import PostSchema from '../model/Post.js'
import jwt from "jsonwebtoken";

export const getPosts = async(req, res) => {
  try {
    const ALlPosts = await PostSchema.find({});
      res.status(200).json({ posts: ALlPosts});
  } catch (error) {
    res.status(500).json({ msg: "something went wrong"});
  }
};

export const getPost = async(req, res) => {
  const {id} = req.params
  try {
    const ALlPosts = await PostSchema.findById(id);
    res.status(200).json({ ALlPosts: ALlPosts});
  } catch (error) {
    res.status(500).json({ msg: "something went wrong"});
  }
};

export const addPost = async(req, res) => {
  const {value , desc,cat,img, userName} = req.body
  console.log({value , desc,cat,img, userName});
  try {
    await PostSchema.create({
      title: value,
      desc: desc,
      img: img,
      userId: userName,
      cat:cat
    });
  res.status(200).json({ posts: "Post created"});
  } catch (error) {
  res.status(500).json({ posts: "Post not created"});
  }
};

export const deletePost = async(req, res) => {
  const {id} = req.params
  try {
    await PostSchema.findByIdAndDelete({ _id: id });
    res.status(200).json({
      msg: "deleted successfully",
    });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};

export const updateLikes = async(req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostSchema.findById(postId);
    console.log(post);
    post.likes += 1;
    await post.save();
    res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error liking the post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateComments = async(req, res) => {
  try {
    const postId = req.params.id;
    const { text, user } = req.body;
    const post = await PostSchema.findById(postId);

    post.comments.push({ text, user });
    await post.save();

    res.json({ post: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updatePost = async(req, res) => {
  try {
  const {id} = req.params
  const {value, desc, img, cat} = req.body
    await PostSchema.updateOne(
      { _id: id },
      {
        $set: {
          title: value,
          desc: desc.replace(/<p>/g, '').replace(/<\/p>/g, ''),
          img: img,
          cat:cat
        },
      }
    );
    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({ msg: "something went wrong"});
  }
};