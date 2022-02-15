import { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import { createUserWithEmailAndPassword } from "firebase/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  //TBH I don't really understand this useEffect, I have copied code from the latest documentation (as of 15 feb 2022)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // User has logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // User has logged out
        setUser(null);
      }
    });

    //cleanup
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    const q = query(collection(db, "posts"));

    onSnapshot(q, (querySnapshot) => {
      const postArray = [];
      querySnapshot.forEach((doc) => {
        postArray.push({ id: doc.id, post: doc.data() });
      });
      setPosts(postArray);
    });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        setOpen(false);
        return (userCredential.user.displayName = username);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`${errorCode} : ${errorMessage}`);
      });
  };

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <Typography id="modal-modal-title" variant="h6" component="h1">
                SIGN UP
              </Typography>
            </center>

            <br></br>
            <Input
              fullWidth={true}
              value={email}
              placeholder="E-mail"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
            />
            <Input
              fullWidth={true}
              value={username}
              placeholder="Username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
            />
            <Input
              fullWidth={true}
              value={password}
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
            />

            <Button onClick={signUp}>Sign Up</Button>
          </form>
        </Box>
      </Modal>

      <div className="app__header">
        <img
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="instagram logo"
          className="app__headerImage"
        ></img>
      </div>

      {user ? (
        <Button>Sign Out</Button>
      ) : (
        <Button
          onClick={() => {
            setOpen(true);
          }}
        >
          Sign Up
        </Button>
      )}

      {posts.map(({ id, post }) => {
        return (
          <Post
            key={id}
            imageUrl={post.imageUrl}
            username={post.username}
            caption={post.caption}
          />
        );
      })}
    </div>
  );
}

export default App;
