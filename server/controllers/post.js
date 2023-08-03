import PostSchema from '../model/Post.js'
import jwt from "jsonwebtoken";

export const getPosts = async(req, res) => {
  try {
    const ALlPosts = await PostSchema.find({}).sort({ _id: -1 });
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
  const {value , desc,cat,img, userName , type} = req.body
  try {
    await PostSchema.create({
      title: value,
      desc: desc,
      img: img,
      userId: userName,
      cat:cat,
      imgType: type
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
    const userId = req.body.userId;
    const post = await PostSchema.findById(postId);

    // Check if the user has already liked the post
    if (post.likedBy.includes(userId)) {
      return res.status(400).json('You have already liked the post.' );
    }

    post.likes++;
    post.likedBy.push(userId);
    await post.save();

    return res.json({ likes: post.likes })
  } catch (error) {
    console.error('Error liking the post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteLike = async(req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId;
    const post = await PostSchema.findById(postId);

    // Check if the user has not liked the post
    if (!post.likedBy.includes(userId)) {
      return res.status(400).json('You have not liked the post.');
    }

    post.likes--;
    post.likedBy.pull(userId);
    await post.save();

    return res.json({ likes: post.likes });
  } catch (error) {
    console.error('Error disliking the post:', error);
    return res.status(500).json({ message: 'Error disliking the post' });
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
  const {value, desc, img, cat , type} = req.body

  const updateData = {
    title: value,
    desc: desc.replace(/<p>/g, '').replace(/<\/p>/g, ''),
    cat: cat,
  };
  
  if (img) {
    updateData.img = img;
    updateData.imgType = type;

  }

    await PostSchema.updateOne(
      { _id: id },{ $set: updateData }
    );
    res.status(200).json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    res.status(500).json({ msg: "something went wrong"});
  }
};
