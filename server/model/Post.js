import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  desc: String,
  date: String,
  img: String,
  userId: String,
  username: String,
  cat:String,
  likes: { type: Number, default: 0 },
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