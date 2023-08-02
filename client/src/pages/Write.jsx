import React, { useState , useContext, useEffect} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/authContext";
import Unauth from "../Unauthorization/Unauthorization";


const Write = () => {
  const token = localStorage.getItem("Token");

  const state = useLocation().state;
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState(state?.title || "");
  const [desc, setDesc] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate()

  useEffect(() => {
    if(!currentUser){
      navigate("/unAuth")
    }

  }, []);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(process.env.REACT_APP_BACKEND_URL + "api/upload", formData,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };
  const handleEditorChange = (content) => {
    setDesc(content);
  };

  const uploadFile = async () =>{
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", 'blob_preset')

    try {
      let cloudName = process.env.REACT_APP_CLOUD_NAME
      let resourceType = 'auto'
      let api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`

      const res = await axios.post(api, data);
      const { secure_url } = res.data
      return secure_url
    } catch (error) {
      
    }
  }
  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await uploadFile();
console.log(imgUrl);
    try {
      state
        ? await axios.put(process.env.REACT_APP_BACKEND_URL + `api/posts/${state._id}`, {
          value,
            desc,
            cat,
            img: file ? imgUrl : "",
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
        : await axios.post(process.env.REACT_APP_BACKEND_URL + `api/posts/`, {
          value,
            desc,
            cat,
            img: file ? imgUrl : "",
            userName:currentUser?.user.UserName,
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            }
          });
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
   { currentUser &&
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={desc}
            onChange={handleEditorChange}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "Travel"}
              name="cat"
              value="Travel"
              id="Travel"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Travel">Travel</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "Adventure"}
              name="cat"
              value="Adventure"
              id="Adventure"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Adventure">Adventure</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "Health"}
              name="cat"
              value="Health"
              id="Health"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Health">Health</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "Technology"}
              name="cat"
              value="Technology"
              id="Technology"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Technology">Technology</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "Fashion"}
              name="cat"
              value="Fashion"
              id="Fashion"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="Fashion">Fashion</label>
          </div>
          <div className="cat">
            <input
              type="radio"
              checked={cat === "food"}
              name="cat"
              value="food"
              id="food"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="food">Food</label>
          </div>
        </div>
      </div>
    </div>
   }
    </>
  );
};

export default Write;
