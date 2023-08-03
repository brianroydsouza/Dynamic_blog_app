import React, { useContext } from "react";
import { Link , useNavigate} from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate()

  const handleLogout = () => {
    logout();
    navigate("/")
  };


  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" >
            <h6>Travel</h6>
          </Link>
          <Link className="link">
            <h6>Adventure</h6>
          </Link>
          <Link className="link">
            <h6>Health </h6>
          </Link>
          <Link className="link">
            <h6>Technology </h6>
          </Link>
          <Link className="link">
            <h6>Fashion </h6>
          </Link>
          <Link className="link">
            <h6>Food</h6>
          </Link>
          <span>{ currentUser && ( <>Hey {currentUser?.user.UserName}</>)}</span>
          {currentUser ? (
            <span onClick={handleLogout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
         {currentUser?.user.Role === "Admin"?<span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>: null}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
