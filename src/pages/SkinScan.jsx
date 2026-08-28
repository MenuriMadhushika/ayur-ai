import React from "react";
import SkinScanCard from "../components/SkinScanCard";
import "./SkinScan.css";

const SkinScanPage = () => {
  return (
    <main className="skin-scan-page">

      {/* =====================================================
          SKIN SCAN
      ===================================================== */}

      <SkinScanCard />

    </main>
  );
};

export default SkinScanPage;