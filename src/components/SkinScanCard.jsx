import React, { useState, useRef } from "react";

function SkinScanCard() {
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);

  // Handle image upload from file picker or drag-and-drop
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Simulate AI Scan processing
  const handleAnalyze = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        dosha: "Pitta-Vata Imbalance",
        hydration: "78%",
        inflammation: "Low (Mild Redness)",
        recommendation: "Cooling Neem & Mint Formulation",
      });
    }, 2500);
  };

  const resetScan = () => {
    setImagePreview(null);
    setScanResult(null);
  };

  return (
    <div className="skin-scan-card">
      <span className="badge">AYURVISION AI ENGINE</span>
      <h2 className="title">Real-time AI Skin Analysis</h2>
      <p className="subtitle">
        Upload a clear photo to detect subtle dosha imbalances, hydration levels, and inflammation patterns.
      </p>

      {!imagePreview ? (
        <div
          className="dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
          <div className="upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="upload-text">Click or drag image to upload</p>
          <p className="upload-subtext">Supports JPG, PNG (Clear lighting recommended)</p>
        </div>
      ) : (
        <div className="preview-container">
          <div className={`image-wrapper ${isScanning ? "scanning" : ""}`}>
            <img src={imagePreview} alt="Uploaded Skin Scan" />
            {isScanning && <div className="scan-line"></div>}
          </div>

          {!scanResult && !isScanning && (
            <div className="action-buttons">
              <button className="primary-btn" onClick={handleAnalyze}>
                Run AI Analysis
              </button>
              <button className="secondary-btn" onClick={resetScan}>
                Change Photo
              </button>
            </div>
          )}

          {isScanning && <p className="status-text">Analyzing skin metrics with AyurVision AI...</p>}

          {scanResult && (
            <div className="scan-results">
              <h3>Analysis Complete</h3>
              <ul>
                <li><strong>Primary Imbalance:</strong> {scanResult.dosha}</li>
                <li><strong>Hydration Level:</strong> {scanResult.hydration}</li>
                <li><strong>Inflammation:</strong> {scanResult.inflammation}</li>
                <li><strong>Recommended Match:</strong> {scanResult.recommendation}</li>
              </ul>
              <button className="secondary-btn" onClick={resetScan}>
                Scan Another Photo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SkinScanCard;