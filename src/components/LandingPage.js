import { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./LandingPage.css";
import { auth, db } from "../fireabse";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import UserSvg from "./user.svg";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { doc, deleteDoc,updateDoc } from "firebase/firestore";
import {ref,remove} from 'firebase/database'
import Header from "./Header";

function LandingPage() {
  const [search, setSearch] = useState("");
  const [listening, setListening] = useState(false);
  const [audioInput, setAudioInput] = useState(false);
  const [user,loading] = useAuthState(auth);
  const [photoUrl, setPhotoUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const { transcript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('User',user)
    document.getElementById("search").focus();
    if (user) {
      setPhotoUrl(user.photoURL);
      console.log("user>>", user);
      console.log("photo>>", user.photoURL);
      navigate("/landing");
    }
  },[user,loading]);
  useEffect(() => {
    fetchBookmarks();
  }, [user]);

  function logoutFun() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("User Logged Out");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    if (listening) {
      setAudioInput(true);
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    } else {
      SpeechRecognition.stopListening();
    }
    setSearch(transcript);
  }, [listening]);


  useEffect(() => {
    if (audioInput) {
      if (search.trim() !== "") {
        setTimeout(() => {
          searchOnGoogle();
        }, 1000);
      }
    }
  }, [audioInput]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  async function searchOnGoogle() {
    if (search.trim() === "") {
      alert("Please enter something to search");
    } else {
      setAudioInput(false);
      try{
        let newSearch ={
          title:search,
          time: Date.now()
        }
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/history`),
          newSearch
        )
        let newArray = searchHistory
        newArray.unshift(newSearch)
        setSearchHistory(newArray)
        console.log(searchHistory)
      }catch(e){
        toast.error(e.message)
      }
      window.open(`http://google.com/search?q=${search}`);
    }
    setSearch("");
  }



  async function handleRightClick(e, index) {
    e.preventDefault();
    const res = prompt(`Please select 'edit' or 'delete'`);
    if (!res) return;
    if (res.toLocaleLowerCase() === "edit") {
      const updatedTitle = prompt('Enter new title')
      const updatedUrl = prompt('Enter updated url')
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      const queryId = querySnapshot.docs[index].id
      const bookmarkRef = doc(db,'bookmarks',queryId)
      console.log(bookmarkRef);
      await updateDoc(bookmarkRef,{
        title:updatedTitle,
        url:updatedUrl
      })
      toast.success('Updated')
    } else if (res.toLocaleLowerCase() === "delete") {
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      const queryId = querySnapshot.docs[index].id
      console.log(queryId);
      await deleteDoc(doc(db, "bookmarks", queryId))
      toast.success('Deleted')
    } else {
      return toast.error("Please select value only between 'edit' or 'delete'");
    }
  }
  function handleLeftClick(url) {
    window.open(url, "_blank");
  }
  async function addNewBookMark() {
    if (bookmarks.length === 10) {
      return toast.error("You have reached the limit of 10 bookmarks");
    }
    const bookmark = prompt("Enter Title");
    const bookmarkUrl = prompt("Enter URL");
    if(!bookmark || !bookmarkUrl) return
    if (bookmark.trim().length > 0 && bookmarkUrl.trim().length > 0) {
      let newBookmark = {
        title: bookmark,
        url: bookmarkUrl,
      };
      try {
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/bookmarks`),
          newBookmark
        );
        let newArr = bookmarks;
        newArr.unshift(newBookmark);
        setBookmarks(newArr);
        fetchBookmarks();
        toast.success("Bookmark added successfully");
      } catch (e) {
        console.log(e.message);
        toast.error("Couldn't add Bookmark!");
      }
    } else {
      return toast.error("Couldn't add Bookmark!");
    }
  }

  async function fetchBookmarks() {
    if (user) {
      const q = query(collection(db, `users/${user.uid}/bookmarks`));
      const querySnapshot = await getDocs(q);
      let bookmarksArray = [];
      querySnapshot.forEach((doc) => {
        bookmarksArray.push(doc.data());
      });
      setBookmarks(bookmarksArray);
      console.log("BB-", bookmarksArray);
    }
  }

  function handleListening() {
    window.open(`http://google.com/search?q=${search}`)
  }

  return (
    <div class="container">
      <Header />
      <div className="user-container">
        {user && (
          <div class="logout-logo">
            {user.photoURL ? (
              <img src={user.photoURL} className="user-img" alt="Profile pic" />
            ) : (
              <img src={UserSvg} />
            )}
            <p className="logo link" onClick={logoutFun}>
              <i>Logout</i>
            </p>
          </div>
        )}
      </div>
      <div class="welcomeMsg">
        <h1>Welcome {user ? user.displayName : ""} ♥</h1>
      </div>
      <div class="search-bar">
        <input
          type="text"
          id="search"
          placeholder="Type here to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchOnGoogle();
            }
          }}
        />
        {listening ? (
          <span
            onClick={() => setListening(!listening)}
            class="mic-icon material-symbols-outlined"
          >
            mic
          </span>
        ) : (
          <span
            onClick={() => setListening(!listening)}
            class="mic-icon material-symbols-outlined"
          >
            mic_off
          </span>
        )}
        <button id="btn" onClick={() => searchOnGoogle()}>
          Search
        </button>
      </div>
      <div class="faviroutes">
        {bookmarks && bookmarks.length != 0 ? (
          bookmarks.map((bookmark, index) => (
            <button
              key={index}
              onContextMenu={(e) => handleRightClick(e, index)}
              onClick={(e) => handleLeftClick(bookmark.url)}
            >
              {bookmark.title}
            </button>
          ))
        ) : (
          <></>
        )}
      </div>
      <button className="add-bookmark-btn" onClick={() => addNewBookMark()}>
        {bookmarks.length > 0 ? "Add New Bookmark" : "Add your first Bookmark"}
      </button>
    </div>
  );
}

export default LandingPage;
