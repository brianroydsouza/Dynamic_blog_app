import React from "react";
import {useNavigate } from "react-router-dom";
import './Unauthorization.css'

const Unauth = (props) => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login")
  };
  return (
    <>
      <div className="container-fluid">
        <img
          src="/aunauthorization.jpg"
          className="img-container ml-4"
          alt=""
          style={{ height: '80vh', width: '95vw' }}
        />
        <div className="container d-flex justify-content-center" >
          <button id="LoginBtn" onClick={login}>Return to login In page</button>
        </div>
      </div>
    </>
  );
};

export default Unauth;
