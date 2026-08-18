import React from "react";
import { Link } from "react-router-dom";

function DoshaCard() {
  return (
    <div className="dosha-card">
      <h2>What is your Ayurvedic type?</h2>
      
      <div className="dosha-list">
        <p>VATA 🌬️ Dry</p>
        <p>PITTA 🔥 Sensitive</p>
        <p>KAPHA 🌿 Oily</p>
      </div>

      <div style={{ marginTop: "16px" }}>
        {/* Make sure className="discover-btn" is right here */}
        <Link to="/dosha-test" className="discover-btn">
          Learn about your Dosha
        </Link>
      </div>
    </div>
  );
}

export default DoshaCard;