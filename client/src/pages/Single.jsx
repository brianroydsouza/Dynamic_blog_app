import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";
import ShareButtons from './ShareButton';
const Single = () => {
  const postUrl = window.location.href
  const [post, setPost] = useState({});
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];
  const { currentUser } = useContext(AuthContext);
  const token = localStorage.getItem("Token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_BACKEND_URL + `api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPost(res.data.ALlPosts);
        setLikes(res.data.ALlPosts.likes)
        setLiked(res.data.ALlPosts.likedBy[0] == currentUser.user._id);
        setComments(res.data.ALlPosts.comments);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      await axios.delete(process.env.REACT_APP_BACKEND_URL + `api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  const handleLike = async () => {
    try {
      if (!liked) {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_URL + `api/posts/${postId}/like`,
          { userId: currentUser.user._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikes(response.data.likes);
        setLiked(true);
      } else {
        const response = await axios.delete(
          process.env.REACT_APP_BACKEND_URL + `api/posts/${postId}/like`,
          {
            data: { userId: currentUser.user._id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikes(response.data.likes);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };
  const handleAddComment = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + `api/posts/${postId}/comments`, { text: newComment, user: currentUser.user.UserName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setComments(response.data.post);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }
  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">

          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser?.user.Role === "Admin" && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
          <p>Likes: {likes}</p>

          {currentUser && (
            liked ? (
              <button onClick={handleLike}>Dislike</button>
            ) : (
              <button onClick={handleLike}>Like</button>
            )
          )}
          <ShareButtons postUrl={postUrl} />
        </div>
        <h1>{post.title}</h1>

        <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.desc),
          }}
        ></p>
        <div>
          <h4 className="CommentsSection">Comments Section</h4>
          {comments && comments.map((comment) => (
            <>
              <p key={comment?._id}> <span className="userNamecomment">{comment?.user}:</span> <p className="comments">{comment?.text}</p> </p>
            </>

          ))}
        </div>
        <div>
          <textarea type="text" value={newComment} onChange={handleCommentChange} />
        </div>
        {currentUser && <button className="commentBtn" onClick={handleAddComment}>Add Comment</button>}
      </div>
    </div>
  );
};

export default Single;
