import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  updateLikes,
  updateComments,
} from "../controllers/post.js";
import {auth} from  "../middleware/auth.js"

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/",auth, addPost);
router.delete("/:id",auth, deletePost);
router.put("/:id",auth, updatePost);
router.post("/:id/like", updateLikes);
router.post("/:id/comments",auth, updateComments);

export default router;
