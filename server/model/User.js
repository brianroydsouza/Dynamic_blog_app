import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  UserName: String,
  Role: String,
  Email:  { type: String, required: true, unique: true },
  Password: String,
  img: String,
});

const Users = mongoose.model('UsersDetails', UserSchema);

export default Users; 