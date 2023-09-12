import { useEffect, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import './App.css';

function App() {

  const [search, setSearch] = useState('')
  const [listening, setListening] = useState(false);
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (listening) {
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    } else {
      SpeechRecognition.stopListening()
    }
    setSearch(transcript)
  }, [listening])


  if (!browserSupportsSpeechRecognition) {
    return null
  }


  function searchOnGoogle() {
    if (search.trim() === "") {
      alert("Please enter something to search");
    }
    else {
      window.open(`http://google.com/search?q=${search}`);
    }
    setSearch("")
  }

  return (
    <div class="container">
      <div class="welcomeMsg">
        <h1>Welcome Shubham ♥</h1>
      </div>
      <div class="search-bar">
        <input
          type="text"
          id="search"
          placeholder="Type here to search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              searchOnGoogle();
            }
          }}
        />
        {
          listening ?
            <span onClick={() => setListening(!listening)} class="mic-icon material-symbols-outlined">mic</span>
            :
            <span onClick={() => setListening(!listening)} class="mic-icon material-symbols-outlined">mic_off</span>
        }
        <button id="btn" onClick={() => searchOnGoogle()}>Search</button>
      </div>
      <div class="faviroutes">
        <a href="https://chat.openai.com/chat" target="_blank"><button>Chat GPT</button></a>
        <a href="https://www.google.co.in/webhp?gfe_rd=cr&dcr=0&ei=Z5dYWuSUM7GdX6fZm8gK" target="_blank"><button>Google</button></a>
        <a href="https://course.acciojob.com" target="_blank"><button>Acciojob</button></a>
        <a href="https://github.com" target="_blank"><button>Github</button></a>
        <a href="https://www.youtube.com" target="_blank"><button>YouTube</button></a>
      </div>
    </div>
  );
}

export default App;
