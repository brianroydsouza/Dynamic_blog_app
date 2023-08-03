import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [Allposts, setAllPosts] = useState([]);
  const token = localStorage.getItem("Token");
  const category = useLocation().search

  useEffect(()=>{
    if(category){
      const filteredPosts = Allposts.filter((post) => post.cat === category.split('?cat=')[1]);
      setPosts(filteredPosts)
    }else{
      setPosts(Allposts)
    }
  },[category])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_BACKEND_URL + 'api/posts', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setPosts(res.data.posts);
        setAllPosts(res.data.posts);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  // const posts = [
  //   {
  //     id: 1,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 2,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 3,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/4230630/pexels-photo-4230630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  //   {
  //     id: 4,
  //     title: "Lorem ipsum dolor sit amet consectetur adipisicing elit",
  //     desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. A possimus excepturi aliquid nihil cumque ipsam facere aperiam at! Ea dolorem ratione sit debitis deserunt repellendus numquam ab vel perspiciatis corporis!",
  //     img: "https://images.pexels.com/photos/6157049/pexels-photo-6157049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  //   },
  // ];

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }
  return (
    <div className="home">
      <div className="posts">
        {posts.length > 0 ? posts.map((post) => (
          <div className="post" key={post._id}>
            <div className="img">
              {post.imgType === "image" ? (
                <img src={post?.img} alt="" />
              ) : post.imgType === "video" ? (
                <video controls>
                  <source src={post?.img} type="video/mp4" />
                  Your browser does not support HTML video.
                </video>
              ) :
                <iframe
                  width="660"
                  height="315"
                  src={`https://www.youtube.com/embed/${post?.img.split('watch?v=')[1]}`}
                  title="YouTube Video Player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              }
            </div>
            <div className="content">
              <h1>{post.title}</h1>
              <p>{getText(post.desc)}</p>
              <Link className="link" to={`/post/${post._id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        )) : <span className="NoPosts">No Posts</span>}
      </div>
    </div>
  );
};

export default Home;
