import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./FacialExpression.css"
import axios from "axios";
export default function FacialExpression({setSongs}) {
  const videoRef = useRef();
  const [currentMood, setCurrentMood] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMoodConfirmation, setShowMoodConfirmation] = useState(false);
  const [uploadingMood, setUploadingMood] = useState("");

  const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };
    const startVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Error accessing webcam: ", err));
    };
  
    async function detectMood() {
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceExpressions();
          let mostProbableExpression = 0
          let _expression = '';
          
          if(!detections || detections.length === 0){
            alert("No face detected");
            return;
          }

          for(const expression of Object.keys(detections[0].expressions)) {
            if(detections[0].expressions[expression] > mostProbableExpression) {
              mostProbableExpression = detections[0].expressions[expression];
              _expression = expression
            }
          }
            // console.log(_expression)
            setCurrentMood(_expression);
            axios.get(`http://localhost:3000/songs?mood=${_expression}`)
            .then(response => {
              console.log(response.data.songs);
              setSongs(response.data.songs)
            })
    }

    const handleUploadClick = () => {
      document.getElementById('song-upload').click();
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      setSelectedFile(file);

      const formData = new FormData();
      formData.append('audio', file);

      try {
        const response = await axios.post('http://localhost:3000/songs/mood', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploadingMood(response.data.mood);
        setShowMoodConfirmation(true);
      } catch (error) {
        console.error('Error detecting mood:', error);
        alert('Error detecting mood.');
      }
    };

    const confirmUpload = async () => {
      if (!selectedFile || !uploadingMood) {
        alert("No file or mood to upload.");
        return;
      }

      const formData = new FormData();
      formData.append('audio', selectedFile);
      formData.append('mood', uploadingMood);
      formData.append('title', selectedFile.name); // You might want to get title and artist from user input
      formData.append('artist', "Unknown Artist"); // Placeholder

      try {
        const response = await axios.post('http://localhost:3000/songs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert(response.data.message);
        setSelectedFile(null);
        setUploadingMood("");
        setShowMoodConfirmation(false);
      } catch (error) {
        console.error('Error uploading song:', error);
        alert('Error uploading song.');
      }
    };

    const cancelUpload = () => {
      setSelectedFile(null);
      setUploadingMood("");
      setShowMoodConfirmation(false);
    };
    
  useEffect(() => {
  
  

    loadModels().then(startVideo);
}, []);
  return (
    <div className="video-container pt-10  ">
      <section>
        <h1 className="text-2xl  font-bold  py-4">Live Mood Detection</h1>
      <video
        ref={videoRef}
        autoPlay
        muted
        className="user-video-feed"
      />
      </section>
      <div>
        <div  ><h1 className="font-semibold pt-7">
          Live Mood Detection</h1>
          <p className="opacity-70 text-black">Your current mood is being analyzed in real-<br>
          </br>time. Enjoy music tailored to your feelings.</p></div>
      <div className="flex flex-row">
        <section className="flex flex-row justify-around gap-5">
        <button onClick={detectMood} className=" rounded-xl bg-[#5F1AE9] h-8 w-full text-white text-sm">Start Listening</button>
        <button onClick={handleUploadClick} className=" rounded-xl bg-[#5F1AE9] h-8 w-full text-white text-sm ">Upload Song</button>
        </section>
        {currentMood && <p className="ml-2">Mood: {currentMood}</p>}
        <input type="file" id="song-upload" style={{ display: 'none' }} className="w-10 h-2 bg-red-500" onChange={handleFileUpload} />
      </div>
      {showMoodConfirmation && (
        <div className="mood-confirmation-dialog absolute bg-white p-4 rounded-md shadow-lg">
          <p>Detected Mood: {uploadingMood}</p>
          <p>Do you want to upload this song with this mood?</p>
          <button onClick={confirmUpload} className="px-4 py-2 bg-green-500 text-white rounded-md mr-2">Yes</button>
          <button onClick={cancelUpload} className="px-4 py-2 bg-red-500 text-white rounded-md">No</button>
        </div>
      )}
  </div>
    </div>
  );
}
