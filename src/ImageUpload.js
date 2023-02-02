import React, { useState } from "react";
import Button from "@mui/material/Button";
import { storage, db, realtimeDatabase } from "./firebase";
import {
  ref as ref_storage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { ref as ref_database, set } from "firebase/database";
import "./ImageUpload.css";
import pixels from "image-pixels";
// import getPixels from "get-pixels";

const convertToGrayScale = async (rgbaArr) => {
  const channelSize = rgbaArr.length / 4;
  const r = rgbaArr.slice(0, channelSize);
  const g = rgbaArr.slice(channelSize, 2 * channelSize);
  const b = rgbaArr.slice(2 * channelSize, 3 * channelSize);
  const gs = [];
  for (var i = 0; i < channelSize; i++) {
    gs.push(Math.round(0.299 * r[i] + 0.587 * g[i] + 0.114 * b[i]));
  }
  return gs;
};

function ImageUpload(props) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [grayscaleArray, setGrayscaleArray] = useState([]);

  const handleChange = (e) => {
    // var url = URL.createObjectURL(e.target.files[0]);
    pixels(e.target.files[0]).then((a) => {
      console.log(a.data);
      convertToGrayScale(a.data).then((gs) => {
        console.log(gs);
        setGrayscaleArray(gs);
      });
    });
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const imageRef = ref_storage(storage, `images/${image.name}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(imageRef).then((url) => {
        const imageUrl = url;
        addDoc(collection(db, "posts"), {
          username: props.username,
          caption: caption,
          imageUrl: imageUrl,
          timeStamp: serverTimestamp(),
          // comments:[]
        });
        alert("Image has been uploaded!");
        setCaption("");
        setImage(null);
      });
    });

    //postID generation formula : username + stringified date-time of upload
    const username = localStorage.getItem("username");
    const postID = username + Date.now().toString();
    const timeStamp = Date.now();
    set(ref_database(realtimeDatabase, "posts/" + postID), {
      username: username,
      postID: postID,
      grayScaleImage: grayscaleArray,
      caption: caption,
      timeStamp: timeStamp,
    }).then(() => {
      alert("Grayscale img has been uploaded");
      setCaption("");
      setGrayscaleArray([]);
      setImage(null);
    });
  };

  return (
    <div className="imageUpload">
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
