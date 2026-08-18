import React, { useState } from "react";

const Dashboard = () => {
  // Simple state for tracking completed skincare steps
  const [routine, setRoutine] = useState({
    amCleanser: false,
    amMoisturizer: false,
    amSunscreen: false,
    pmCleanser: false,
    pmSerum: false,
    pmNightCream: false,
  });

  // Toggle checkbox status
  const handleToggle = (key) => {
    setRoutine((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Calculate overall daily completion percentage
  const totalTasks = Object.keys(routine).length;
  const completedTasks = Object.values(routine).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Daily Skincare Routine</h1>
      <p style={styles.subtitle}>Track your daily Ayurvedic wellness habits</p>

      {/* Progress Bar */}
      <div style={styles.progressCard}>
        <div style={styles.progressHeader}>
          <span>Today's Progress</span>
          <span>{progressPercent}% Completed</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Morning & Evening Routine Checklist */}
      <div style={styles.grid}>
        {/* Morning Routine */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Morning Routine (AM)</h2>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.amCleanser}
              onChange={() => handleToggle("amCleanser")}
            />
            White Mint Facial Cleanser
          </label>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.amMoisturizer}
              onChange={() => handleToggle("amMoisturizer")}
            />
            Sandalwood Day Moisturiser
          </label>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.amSunscreen}
              onChange={() => handleToggle("amSunscreen")}
            />
            Ayurvedic Sun Protection
          </label>
        </div>

        {/* Evening Routine */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Evening Routine (PM)</h2>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.pmCleanser}
              onChange={() => handleToggle("pmCleanser")}
            />
            Gentle Herbal Cleanser
          </label>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.pmSerum}
              onChange={() => handleToggle("pmSerum")}
            />
            True Turmeric Soothing Serum
          </label>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={routine.pmNightCream}
              onChange={() => handleToggle("pmNightCream")}
            />
            Precious Oils Rejuvenating Cream
          </label>
        </div>
      </div>
    </div>
  );
};

// Simple Styles
const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px 20px",
    color: "#F8F3E8",
  },
  title: {
    fontSize: "28px",
    color: "#C9A24A",
    margin: "0 0 5px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "rgba(248, 243, 232, 0.7)",
    marginBottom: "24px",
  },
  progressCard: {
    background: "rgba(6, 59, 42, 0.6)",
    border: "1px solid #C9A24A",
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "24px",
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "14px",
    marginBottom: "8px",
  },
  progressBarBg: {
    height: "10px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    background: "#C9A24A",
    transition: "width 0.3s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  card: {
    background: "rgba(6, 59, 42, 0.6)",
    border: "1px solid rgba(201, 162, 74, 0.3)",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardTitle: {
    fontSize: "18px",
    color: "#C9A24A",
    margin: "0 0 8px 0",
  },
  checkLabel: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
};

export default Dashboard;