import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AspectRatio from "@mui/joy/AspectRatio";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ModeCommentOutlined from "@mui/icons-material/ModeCommentOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import Face from "@mui/icons-material/Face";
import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
import DOMPurify from "dompurify";
import moment from "moment";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [Allposts, setAllPosts] = useState([]);
  const token = localStorage.getItem("Token");
  const category = useLocation().search;

  useEffect(() => {
    if (category) {
      const filteredPosts = Allposts.filter(
        (post) => post.cat === category.split("?cat=")[1]
      );
      setPosts(filteredPosts);
    } else {
      setPosts(Allposts);
    }
  }, [category]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_BACKEND_URL + "api/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(res.data.posts);
        setAllPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent;
  };
  return (
    <div className="home">
      <div className="posts">
        {posts.length > 0 ? (
          posts.map((post) => (
            <>
              <Card
                variant="outlined"
                sx={{
                  minWidth: "50vw",
                  maxWidth: "60vw",
                  "--Card-radius": (theme) => theme.vars.radius.xs,
                }}
              >
                <CardOverflow>
                  <AspectRatio>
                    {post.imgType === "image" ? (
                      <img
                        className="dispalyIMG"
                        src={post?.img}
                        alt="blogImg"
                        loading="lazy"
                      />
                    ) : post.imgType === "video" ? (
                      <video controls className="dispalyIMG">
                        <source src={post?.img} type="video/mp4" />
                        Your browser does not support HTML video.
                      </video>
                    ) : (
                      <iframe
                        className="dispalyIMG"
                        width="660"
                        height="315"
                        src={`https://www.youtube.com/embed/${
                          post?.img.split("watch?v=")[1]
                        }`}
                        title="YouTube Video Player"
                        allowFullScreen
                      ></iframe>
                    )}
                  </AspectRatio>
                </CardOverflow>
                <CardContent
                  orientation="horizontal"
                  sx={{ alignItems: "center", mx: -1 }}
                >
                  <Box sx={{ width: 0, display: "flex", gap: 0.5 }}>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <FavoriteBorder />
                    </IconButton>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <ModeCommentOutlined />
                    </IconButton>
                    <IconButton variant="plain" color="neutral" size="sm">
                      <SendOutlined />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mx: "auto",
                    }}
                  >
                    {[...Array(5)].map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          borderRadius: "50%",
                          width: `max(${6 - index}px, 3px)`,
                          height: `max(${6 - index}px, 3px)`,
                          bgcolor:
                            index === 0
                              ? "primary.solidBg"
                              : "background.level3",
                        }}
                      />
                    ))}
                  </Box>
                  <Box
                    sx={{
                      width: 0,
                      display: "flex",
                      flexDirection: "row-reverse",
                    }}
                  >
                    <IconButton variant="plain" color="neutral" size="sm">
                      <BookmarkBorderRoundedIcon />
                    </IconButton>
                  </Box>
                </CardContent>
                <CardContent>
                  {`${post.likes} Likes`}
                  <Typography fontSize="sm">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.desc),
                      }}
                    ></p>
                  </Typography>
                  <Link
                    className="link"
                    component="button"
                    underline="none"
                    fontSize="sm"
                    startDecorator="…"
                    to={`/post/${post._id}`}
                    sx={{ color: "text.tertiary" }}
                  >
                    Show More...
                  </Link>
                  {moment(post.createdAt).fromNow()}
                </CardContent>
                <CardContent orientation="horizontal" sx={{ gap: 1 }}>
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    sx={{ ml: -1 }}
                  >
                    <Face />
                  </IconButton>
                  <Input
                    variant="plain"
                    size="sm"
                    placeholder="Add a comment…"
                    sx={{ flex: 1, px: 0, "--Input-focusedThickness": "0px" }}
                  />
                  <Link disabled underline="none" role="button">
                    Post
                  </Link>
                </CardContent>
              </Card>
            </>
          ))
        ) : (
          <span className="NoPosts">No Posts</span>
        )}
      </div>
    </div>
  );
};

export default Home;
