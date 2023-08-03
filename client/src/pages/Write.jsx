import React, { useState, useContext, useEffect } from "react";
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
  const [urlType, setUrlType] = useState(null);
  const [url, setUrl] = useState(null);
  const [publishType, setPublishType] = useState(null);

  const navigate = useNavigate()

  useEffect(() => {
    if (!currentUser) {
      navigate("/unAuth")
    }

  }, []);

  const handleEditorChange = (content) => {
    setDesc(content);
  };

  const uploadFile = async () => {
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

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setUrlType(detectUrlType(e.target.value));
  };

  const detectUrlType = (url) => {
    // Regular expression to detect if the URL is a YouTube video
    if (/^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=/.test(url)) {
      return 'youtube';
    }

    // Regular expression to detect if the URL ends with common image file extensions
    if (/\.(jpe?g|png|gif|bmp|webp)$/i.test(url)) {
      return 'image';
    }

    // Assume it's a video URL
    return 'video';
  };

  function isImage(dataURL) {
    return dataURL.startsWith('data:image');
  }

  function isVideo(dataURL) {
    return dataURL.startsWith('data:video');
  }

  const handleClick = async (e) => {
    e.preventDefault();
    if (url) {
      handleApiCall(url, "ItsUrl")
    } else {
      if (file) {
        const imgUrl = await uploadFile();
        const fileReader = new FileReader();
        fileReader.onloadend = function () {
          const dataURL = fileReader.result;
          let type
          if (isImage(dataURL)) {
            console.log('Selected file is an image.');
            type = 'image'
          } else if (isVideo(dataURL)) {
            console.log('Selected file is a video.');
            type = 'video'

          } else {
            console.log('Selected file is neither an image nor a video.');
          }
          handleApiCall(imgUrl, type)
        };
        fileReader.readAsDataURL(file);
      } else {
        handleApiCall(null, null)
      }
    }
  };
  const handleApiCall = async (imgUrl, type) => {
    try {
      state
        ? await axios.put(process.env.REACT_APP_BACKEND_URL + `api/posts/${state._id}`, {
          value,
          desc,
          cat,
          img: imgUrl ? imgUrl : "",
          type: type == "ItsUrl" ? urlType : type,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        : await axios.post(process.env.REACT_APP_BACKEND_URL + `api/posts/`, {
          value,
          desc,
          cat,
          img: imgUrl ? imgUrl : "",
          type,
          userName: currentUser?.user.UserName,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      {currentUser &&
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
              <div className="cat">
                <input
                  type="radio"
                  checked={publishType === "Image"}
                  name="Image"
                  value="Image"
                  id="Image"
                  onChange={(e) => setPublishType(e.target.value)}
                />
                <label htmlFor="Image">Image/Video</label>
              </div>
              <div className="cat">
                <input
                  type="radio"
                  checked={publishType === "Url"}
                  name="Url"
                  value="Url"
                  id="Url"
                  onChange={(e) => setPublishType(e.target.value)}
                />
                <label htmlFor="Url">Url</label>
              </div>
              {
                publishType == "Image" ? (<>
                  <input
                    style={{ display: "none" }}
                    type="file"
                    id="file"
                    name=""
                    onChange={(e) => { setFile(e.target.files[0]); setUrl(null) }}
                  />
                  <label className="file" htmlFor="file">
                    Upload Image
                  </label> </>) :
                  publishType == "Url" ?
                    <input
                      type="text"
                      id="imageUrl"
                      name="imageUrl"
                      value={url}
                      onChange={handleUrlChange}
                      placeholder="Enter Image URL"
                    />
                    : <></>
              }

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
