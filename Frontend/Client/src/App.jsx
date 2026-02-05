import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [images, setImages] = useState([]);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setImages((prev) => [...prev, ...fileArray]);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const convertToPDF = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach((img) => formData.append("images", img));

    const response = await axios.post(
      "https://imagetopdf-converter.onrender.com",
      formData,
      { responseType: "blob" },
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "images.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Image to PDF</h1>
        <p className="subtitle">Upload images and convert them into one PDF</p>

        <div
          className="drop-zone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p>Drag & drop images here</p>
          <span>or</span>
          <input type="file" multiple onChange={handleChange} />
        </div>

        {images.length > 0 && (
          <div className="preview">
            {images.map((img, index) => (
              <div key={index} className="preview-item">
                <img src={URL.createObjectURL(img)} alt="preview" />
                <button onClick={() => removeImage(index)}>✕</button>
              </div>
            ))}
          </div>
        )}

        <button className="convert-btn" onClick={convertToPDF}>
          Convert to PDF
        </button>
      </div>
    </div>
  );
}

export default App;
