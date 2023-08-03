import mongoose from 'mongoose';
import UserSchema from './User.js';
const PostSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: String,
  img: String,
  imgType: String,
  userId: String,
  username: String,
  cat:String,
  likes: { type: Number, default: 0 },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchema', // This establishes the reference to the User model
  }],
  comments: [
    {
      text: String,
      user: String,
      date: { type: Date, default: Date.now },
    },
  ],
 },{ timestamps: true });

const Posts = mongoose.model('Posts', PostSchema);

export default Posts;
