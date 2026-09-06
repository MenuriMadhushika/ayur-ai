import React, { useEffect, useRef, useState } from "react";
import "./SkinScanCard.css";
import { analyzeSkinPhoto, getUserSkinScans } from "../utils/api";
import { saveSkinScanResult } from "../utils/assessmentStatus";
import { getCurrentUserId } from "../utils/userSession";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

const SkinScanCard = () => {
  const inputRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [stage, setStage] = useState("photo");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const loadHistory = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setHistoryLoading(false);
      return;
    }
    setHistoryError("");
    try {
      setHistory(await getUserSkinScans(userId));
    } catch (loadError) {
      setHistoryError(loadError.message || "Unable to load your scan history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return undefined;
    }
    const nextPreviewUrl = URL.createObjectURL(photo);
    setPreviewUrl(nextPreviewUrl);
    return () => URL.revokeObjectURL(nextPreviewUrl);
  }, [photo]);

  const choosePhoto = (file) => {
    setError("");
    setNotice("");
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }
    setPhoto(file);
    setStage("review");
  };

  const removePhoto = () => {
    setPhoto(null);
    setError("");
    setNotice("");
    setStage("photo");
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!photo) {
      setError("Add a clear photo before starting the scan.");
      return;
    }
    setError("");
    setNotice("");
    setStage("analyzing");
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("Your session has expired. Please sign in again.");
      const prediction = await analyzeSkinPhoto(userId, photo);
      setResult(prediction);
      saveSkinScanResult({
        completed: true,
        completedAt: prediction.createdAt || new Date().toISOString(),
        skinType: prediction.estimatedCategory,
        concern: prediction.estimatedCategory || "Uncertain",
        texture: prediction.message,
        confidence: prediction.modelScore,
        modelVersion: prediction.modelVersion,
      });
      await loadHistory();
      setStage("result");
    } catch (analysisError) {
      setError(analysisError.message || "Skin analysis is unavailable. Make sure all three services are running.");
      setStage("review");
    }
  };

  return (
    <section className="skin-scan-section" aria-labelledby="skin-scan-title">
      <header className="skin-scan-header">
        <div>
          <span className="skin-scan-eyebrow">AI-ASSISTED SKIN CHECK</span>
          <h1 id="skin-scan-title">Understand what your skin <em>may be showing.</em></h1>
          <p>Upload one clear, unfiltered photo. AyurAI will check for a small set of visible characteristics and provide educational guidance.</p>
        </div>
        <div className="scan-progress" aria-label="Skin scan progress">
          <div className="progress-step active"><span>1</span><small>Photo</small></div><i />
          <div className={`progress-step ${photo ? "active" : ""}`}><span>2</span><small>Review</small></div><i />
          <div className={`progress-step ${stage === "result" ? "active" : ""}`}><span>3</span><small>Result</small></div>
        </div>
      </header>

      <div className="skin-scan-workspace">
        <div className="photo-panel">
          {stage === "analyzing" ? (
            <div className="analysis-state" role="status">
              <div className="analysis-orbit"><span /></div>
              <span className="drop-kicker">PREPARING ANALYSIS</span>
              <h2>Checking your photo.</h2>
              <p>Confirming image quality and preparing it for the AyurAI model.</p>
            </div>
          ) : stage === "result" ? (
            <div className="result-state">
              <div className="result-symbol" aria-hidden="true">✦</div>
              <span className="drop-kicker">{result?.status === "estimated" ? "ESTIMATED RESULT" : "UNCERTAIN RESULT"}</span>
              <h2>{result?.estimatedCategory ? `${result.estimatedCategory} acne-like appearance` : "A reliable estimate was not possible"}</h2>
              <p>{result?.message}</p>
              <div className="future-result-grid">
                <div><small>ESTIMATED CATEGORY</small><strong>{result?.estimatedCategory || "Uncertain"}</strong></div>
                <div><small>MODEL SCORE</small><strong>{result?.modelScore == null ? "Not available" : `${Math.round(result.modelScore * 100)}%`}</strong></div>
              </div>
              <p>{result?.disclaimer}</p>
              <button type="button" className="retake-button" onClick={removePhoto}>Use another photo</button>
            </div>
          ) : !previewUrl ? (
            <div className="photo-drop-zone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); choosePhoto(event.dataTransfer.files?.[0]); }}>
              <div className="camera-mark" aria-hidden="true"><span /></div>
              <span className="drop-kicker">ADD YOUR PHOTO</span>
              <h2>Face the camera in natural light.</h2>
              <p>Use a front-facing photo without makeup, filters, or harsh shadows.</p>
              <button type="button" onClick={() => inputRef.current?.click()}>Choose photo</button>
              <small>JPG, PNG or WebP · Maximum 5 MB</small>
            </div>
          ) : (
            <div className="photo-preview">
              <img src={previewUrl} alt="Selected skin scan preview" />
              <div className="preview-bar"><div><span>PHOTO READY</span><strong>{photo.name}</strong></div><button type="button" onClick={removePhoto}>Change</button></div>
            </div>
          )}
          <input ref={inputRef} className="visually-hidden-file" type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={(event) => choosePhoto(event.target.files?.[0])} />
        </div>

        <aside className="scan-guidance">
          <span className="guidance-label">BEFORE YOU SCAN</span>
          <h2>A better photo gives a more reliable result.</h2>
          <ul className="photo-checklist">
            <li><span>01</span><div><strong>Natural light</strong><p>Stand near a window and avoid strong yellow or blue lighting.</p></div></li>
            <li><span>02</span><div><strong>Clear, bare skin</strong><p>Remove makeup, glasses, and beauty filters before taking the photo.</p></div></li>
            <li><span>03</span><div><strong>Look straight ahead</strong><p>Keep your face centered, close enough, and fully visible.</p></div></li>
          </ul>
          <div className="privacy-note"><span aria-hidden="true">✦</span><p><strong>Your privacy matters.</strong> The final system should process only the image needed for your result and avoid permanent storage unless you agree.</p></div>
          {error && <p className="scan-message error" role="alert">{error}</p>}
          {notice && <p className="scan-message notice" role="status">{notice}</p>}
          {stage !== "result" && (
            <button type="button" className="analyze-button" disabled={!photo || stage === "analyzing"} onClick={handleAnalyze}>{stage === "analyzing" ? "Preparing scan..." : photo ? "Analyze my photo" : "Add a photo to continue"}<span aria-hidden="true">→</span></button>
          )}
          <p className="medical-disclaimer">AyurAI does not diagnose medical conditions. Seek professional care for painful, changing, persistent, or worrying symptoms.</p>
        </aside>
      </div>

      <section className="scan-history" aria-labelledby="scan-history-title">
        <div className="scan-history-heading">
          <div><span className="skin-scan-eyebrow">YOUR PROGRESS</span><h2 id="scan-history-title">Recent Skin Scans</h2></div>
          <p>Your photos are not stored. Only the educational result and scan date appear here.</p>
        </div>
        {historyLoading ? (
          <p className="history-empty">Loading your scan history…</p>
        ) : historyError ? (
          <p className="scan-message error" role="alert">{historyError}</p>
        ) : history.length === 0 ? (
          <p className="history-empty">Your completed scans will appear here.</p>
        ) : (
          <div className="history-list">
            {history.slice(0, 6).map((scan) => (
              <article className="history-card" key={scan.id}>
                <div><small>{new Date(scan.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</small><strong>{scan.estimatedSkinType || "Uncertain"}</strong></div>
                <span>{(scan.analysisStatus || "completed").toLowerCase()}</span>
                <p>{scan.visibleCharacteristics || "Educational skin scan completed."}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
};

export default SkinScanCard;
