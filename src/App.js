import "./App.css";
import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const uploadRef = useRef();
  const progressRef = useRef();
  const progressPercentRef = useRef();
  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        // add to an array so we can display the name of file
      } else {
        files[i]["invalid"] = true;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        setErrorMessage("File type not permitted");
        // setUnsupportedFiles(prevArray => [...prevArray, files[i]]);
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/x-icon",
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setSelectedFiles((prevArray) => [...prevArray, files[0]]);
    const formData = new FormData();
    formData.append("image", files[0]);
    console.log(files[0]);
    formData.append("key", "b68b2ca206b51da76655d657e95f0ae5");
    axios
      .post("https://api.imgbb.com/1/upload", formData, {
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          progressPercentRef.current.innerHTML = `${uploadPercentage}%`;
          progressRef.current.style.width = `${uploadPercentage}%`;
          if (uploadPercentage === 100) {
          }
        },
      })
      .catch(() => {
        // If error, display a message on the upload modal
        // uploadRef.current.innerHTML = `<span class="error">Error Uploading File(s)</span>`;
        // // set progress bar background color to red
        // progressRef.current.style.backgroundColor = 'red';
      });
    console.log(files);
  };
  return (
    <div className="main-container">
      <div className="drag-container">
        <h1 className="upload-container">Upload your files </h1>
        <div className="drag-down-container">
          <div
            className="drag-drop-container"
            onDragOver={dragOver}
            onDragEnter={dragEnter}
            onDragLeave={dragLeave}
            onDrop={fileDrop}
          >
            <img
              className="folder-image"
              src="https://user-images.githubusercontent.com/47685349/135834663-de44459c-5888-4706-8412-2240a67de019.png"
              alt="folder"
            />
            <p className="drag-drop-text">Drag and Drop Your files</p>
          </div>
        </div>

        <div className="file-display-container">
          {selectedFiles.map((data, i) => (
            <div className="file-container" key={i}>
              <img
                className="file-img"
                src="https://user-images.githubusercontent.com/47685349/135867270-d98477f0-c48c-4dd1-9c69-e7023a2b1a82.png"
                alt=""
              />
              <p className="file-name">{data.name}</p>
              <div className="progress-bar" ref={progressRef}></div>
              <div
                className="progress-indicator"
                ref={progressPercentRef}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
