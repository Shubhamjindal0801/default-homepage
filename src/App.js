import React from 'react'
import './App.css'
import LandingPage from './components/LandingPage'
import Signup from './components/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

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

  useEffect(()=>{
    document.getElementById('search').focus();
  },[])

  /*useEffect(()=>{
    if(search.trim() !== ''){
      setTimeout(()=>{
        searchOnGoogle()
      },1000)
    }
  },[search])*/

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
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App