import React from "react";
import "./Post.css";
import Avatar from '@mui/material/Avatar';

function Post(props) {
  return (
    <div className="post">
    <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="AdityaDeo"
          src="https://wallpapercave.com/wp/wp8721965.jpg"  
        />
      <h3>{props.username}</h3>
    </div>
        
      <img
        className="post__image"
        src={props.imageUrl}
        alt="post"
      ></img>

      <h4 className="post__text">
        <strong>{props.username}:</strong> {props.caption}
      </h4>
    </div>
  );
}

export default Post;
