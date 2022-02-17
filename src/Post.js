import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@mui/material/Avatar";
import { Button } from "@mui/material";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {db} from "./firebase";


function Post(props) {
  const [enteredComment, setEnteredComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(()=>{
    getDoc(doc(db, "comments", props.postID)).then(docSnap => {
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        setComments(docSnap.data().comments);
      } else {
        // console.log(props.postID , " : No such document!");
        setDoc(doc(db, "comments", props.postID), {
          comments: []
        });
      }
    })
    
  },[props.postID]);

  const handlePostComment = (e)=>{
    e.preventDefault();
    setComments((prev)=>{
      return [...prev, {username: localStorage.getItem("username"), comment: enteredComment}]
    })
    updateDoc(doc(db, "comments", props.postID), {
      comments:arrayUnion({username: localStorage.getItem("username"), comment: enteredComment})
    })
    setEnteredComment("");
  }

  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt="AdityaDeo" src="" />
        <h3>{props.username}</h3>
      </div>

      <img className="post__image" src={props.imageUrl} alt="post"></img>

      <h4 className="post__text">
        <strong>{props.username}:</strong> {props.caption}
      </h4>

      <div className="post__commentSection">
        <div className="post__commentSection_comments">
          
            {/* <strong>{props.username}:</strong> {props.caption} */}
            {/* COMMMENT STRUCTURE */}
            {comments.map((comment)=>{
              return (
                <h4 className="post__comment">
                <strong>{comment.username}:</strong> {comment.comment}
                </h4>)
            })}
          
        </div>
        <hr></hr>
        <div className="post__commentSection_input">
          <input
            value={enteredComment}
            onChange={(e) => {
              setEnteredComment(e.target.value);
            }}
            placeholder="Add Comment"
            className="post__commentSection_input_input"
            type="text"
          ></input>
          <Button onClick={handlePostComment}>Post</Button>
        </div>
      </div>
    </div>
  );
}

export default Post;
