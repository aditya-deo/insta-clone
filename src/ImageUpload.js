import React, {useState} from "react";
import Button from "@mui/material/Button";
import {storage, db} from "./firebase";
import {ref, uploadBytes,getDownloadURL } from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import "./ImageUpload.css";

function ImageUpload(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);


  const handleChange = (e) => {
      if(e.target.files[0]){
          setImage(e.target.files[0]);
      }
  };

  const handleUpload = () => {
    const imageRef = ref(storage, `images/${image.name}`);
    uploadBytes(imageRef, image).then((snapshot) => {
        
        getDownloadURL(imageRef)
        .then((url)=>{
            const imageUrl = url;
            addDoc(collection(db, "posts"), {
                username: props.username,
                caption: caption,
                imageUrl: imageUrl,
                timeStamp : serverTimestamp()
              })
              alert("Image has been uploaded!");  
              setCaption("");
              setImage(null);
        })
      });



  };

  return (
    <div className = "imageUpload">
    <label class="custom-file-upload">
        <input type="file" onChange={handleChange} />
        Upload File
      </label>
      <input
        type="text"
        placeholder="Caption"
        className="imageUpload__caption"
        value={caption}
        onChange={(e) => {
          setCaption(e.target.value);
        }}
      />
      <Button onClick={handleUpload}>Upload</Button>
      <br></br>
      <br></br>
    </div>
  );
}

export default ImageUpload;
