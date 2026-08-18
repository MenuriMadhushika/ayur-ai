import React, { useEffect, useState } from "react";
import "./SkinScanCard.css";

const SkinScanCard = () => {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Clean up generated image URL
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // ==============================
  // PROCESS IMAGE
  // ==============================

  const processImage = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    // Limit file size to 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Please upload an image smaller than 10MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setImage(imageUrl);
    setAnalysis(null);
    setAnalyzing(false);
  };

  // ==============================
  // FILE UPLOAD
  // ==============================

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      processImage(file);
    }

    // Allows selecting same image again
    event.target.value = "";
  };

  // ==============================
  // DRAG & DROP
  // ==============================

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      processImage(file);
    }
  };

  // ==============================
  // ANALYZE SKIN
  // ==============================

  const handleAnalyze = () => {
    if (!image || analyzing) return;

    setAnalyzing(true);
    setAnalysis(null);

    // Demo AI analysis
    // Later this can be replaced with your real AI API.
    setTimeout(() => {
      setAnalysis({
        skinType: "Combination",
        hydration: "Medium",
        concern: "Mild dryness & blemishes",
        dosha: "Pitta",
        recommendation:
          "Your skin may benefit from gentle cleansing, lightweight hydration and calming Ayurvedic-inspired ingredients."
      });

      setAnalyzing(false);
    }, 4000);
  };

  // ==============================
  // CHANGE PHOTO
  // ==============================

  const handleChangePhoto = () => {
    setImage(null);
    setAnalysis(null);
    setAnalyzing(false);
    setDragActive(false);
  };

  return (
    <section className="skin-scan-section" id="skin-scan">

      {/* =====================================
          HEADING
      ===================================== */}

      <div className="scan-heading">

        <span className="section-label">
          AYURVISION AI ENGINE
        </span>

        <h2>
          See What Your Skin
          <br />
          <span>Is Telling You</span>
        </h2>

        <p>
          Upload a clear photo and let AyurAI analyse
          visible skin patterns and provide an
          Ayurvedic-inspired skincare profile.
        </p>

      </div>


      {/* =====================================
          MAIN SCANNER
      ===================================== */}

      <div className="scan-container">

        {/* LEFT INFORMATION */}

        <div className="scan-info">

          <div className="scan-number">
            01
          </div>

          <h3>
            AI Skin Analysis
          </h3>

          <p>
            Understand your skin before choosing
            products. AyurAI combines intelligent
            visual analysis with Ayurvedic-inspired
            skincare guidance.
          </p>

          <div className="scan-features">

            <span>
              <b>✓</b>
              Skin condition
            </span>

            <span>
              <b>✓</b>
              Hydration patterns
            </span>

            <span>
              <b>✓</b>
              Ayurvedic balance
            </span>

            <span>
              <b>✓</b>
              Personalized care
            </span>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="upload-wrapper">

          {/* =================================
              UPLOAD BOX
          ================================= */}

          {!image && (

            <div
              className={`upload-area ${
                dragActive ? "drag-active" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >

              <label
                htmlFor="skin-image"
                className="upload-content"
              >

                <div className="upload-icon">
                  ✦
                </div>

                <h3>
                  Upload Your Skin Photo
                </h3>

                <p>
                  Drag & drop your photo here
                </p>

                <div className="or-divider">
                  <span>OR</span>
                </div>

                <span className="upload-button">
                  Choose Image
                </span>

                <small>
                  JPG, PNG or WEBP
                  <br />
                  Clear, well-lit face photo recommended
                </small>

                <input
                  id="skin-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                />

              </label>

            </div>

          )}


          {/* =================================
              IMAGE PREVIEW
          ================================= */}

          {image && (

            <div className="image-preview-container">

              <div
                className={`image-preview ${
                  analyzing ? "is-scanning" : ""
                }`}
              >

                <img
                  src={image}
                  alt="Uploaded skin"
                />


                {/* =================================
                    AI SCANNING ANIMATION
                ================================= */}

                {analyzing && (

                  <div className="ai-scan-overlay">

                    {/* Dark scanning layer */}

                    <div className="scan-glow"></div>


                    {/* Face scanning frame */}

                    <div className="face-scan-frame"></div>


                    {/* Corner markers */}

                    <div className="scan-corner top-left"></div>

                    <div className="scan-corner top-right"></div>

                    <div className="scan-corner bottom-left"></div>

                    <div className="scan-corner bottom-right"></div>


                    {/* Skin detection points */}

                    <div className="face-point point-one"></div>

                    <div className="face-point point-two"></div>

                    <div className="face-point point-three"></div>

                    <div className="face-point point-four"></div>

                    <div className="face-point point-five"></div>


                    {/* Moving scan line */}

                    <div className="photo-scan-line"></div>


                    {/* AI status */}

                    <div className="scan-status">

                      <span className="scan-pulse"></span>

                      AYURVISION AI SCANNING

                    </div>


                    {/* Detection message */}

                    <div className="scan-detection">

                      <span>◈</span>

                      Detecting skin patterns...

                    </div>

                  </div>

                )}


                {/* IMAGE READY */}

                {!analyzing && !analysis && (

                  <div className="image-status">

                    <span className="status-dot"></span>

                    IMAGE READY

                  </div>

                )}

              </div>


              {/* Change photo */}

              {!analyzing && !analysis && (

                <button
                  type="button"
                  className="change-photo-small"
                  onClick={handleChangePhoto}
                >
                  Change Photo
                </button>

              )}

            </div>

          )}

        </div>

      </div>


      {/* =====================================
          ANALYZE BUTTON
      ===================================== */}

      {image && !analysis && !analyzing && (

        <div className="analysis-action">

          <button
            type="button"
            className="analyze-button"
            onClick={handleAnalyze}
          >

            <span className="analyze-icon">
              ✦
            </span>

            <span>
              Analyze My Skin
            </span>

            <span className="arrow">
              →
            </span>

          </button>

          <p>
            Your photo is ready for AyurAI analysis
          </p>

        </div>

      )}


     


      {/* =====================================
          RESULTS
      ===================================== */}

      {analysis && (

        <div className="analysis-result">

          <div className="result-heading">

            <span className="section-label">
              AYURVISION AI RESULT
            </span>

            <h2>
              Your Skin Profile
            </h2>

            <p>
              Here's what AyurAI discovered from your
              uploaded photo.
            </p>

          </div>


          {/* RESULT CARDS */}

          <div className="result-grid">


            {/* SKIN TYPE */}

            <div className="result-card result-skin">

              <span className="result-number">
                01
              </span>

              <div className="result-icon">
                ◈
              </div>

              <span className="result-label">
                SKIN TYPE
              </span>

              <strong>
                {analysis.skinType}
              </strong>

            </div>


            {/* HYDRATION */}

            <div className="result-card result-hydration">

              <span className="result-number">
                02
              </span>

              <div className="result-icon">
                ◌
              </div>

              <span className="result-label">
                HYDRATION
              </span>

              <strong>
                {analysis.hydration}
              </strong>

            </div>


            {/* SKIN CONCERN */}

            <div className="result-card result-concern">

              <span className="result-number">
                03
              </span>

              <div className="result-icon">
                ✧
              </div>

              <span className="result-label">
                SKIN CONCERN
              </span>

              <strong>
                {analysis.concern}
              </strong>

            </div>


            {/* DOSHA */}

            <div className="result-card result-dosha">

              <span className="result-number">
                04
              </span>

              <div className="result-icon">
                ☯
              </div>

              <span className="result-label">
                AYURVEDIC BALANCE
              </span>

              <strong>
                {analysis.dosha}
              </strong>

            </div>

          </div>


          {/* =================================
              RECOMMENDATION
          ================================= */}

          <div className="care-recommendation">

            <div className="care-icon">
              ✦
            </div>

            <div>

              <span>
                PERSONALIZED AYURVEDIC CARE
              </span>

              <p>
                {analysis.recommendation}
              </p>

            </div>

          </div>


          {/* =================================
              ANALYZE ANOTHER PHOTO
          ================================= */}

          <button
            type="button"
            className="another-photo-button"
            onClick={handleChangePhoto}
          >

            <span>
              ↻
            </span>

            Analyze Another Photo

          </button>

        </div>

      )}

    </section>
  );
};

export default SkinScanCard;