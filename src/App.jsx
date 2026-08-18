import ProductDetails from "./components/ProductDetails";
import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";


// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SkinScanCard from "./components/SkinScanCard";
import DoshaSelector from "./components/DoshaSelector";
import ProductCard from "./components/ProductCard";
import DoshaQuestion from "./components/DoshaQuestion";

const products = [
  {
    id: 1,
    name: "True Turmeric",
    description: "Brightening and nourishing skincare",
    price: "LKR 5,950"
  },
  {
    id: 2,
    name: "White Mint",
    description: "Refreshing and cooling skincare",
    price: "LKR 2,950"
  },
  {
    id: 3,
    name: "Neem & Tea Tree",
    description: "Purifying skincare for blemish-prone skin",
    price: "LKR 3,950"
  }
];

// 1. Home Page View
function Home() {
  return (
    <main className="home-container">
      <Hero />

      <DoshaSelector />

      <div className="quick-actions-grid">
        <SkinScanCard />
      </div>

      <section className="featured-products">
        ...
      </section>
    </main>
  );
}

// 2. Dosha Assessment View
function DoshaTestPage() {
  return (
    <div className="dosha-test-container">
      <DoshaQuestion />
    </div>
  );
}

// 3. Skin Scan View Placeholder
function SkinScanPage() {
  return (
    <div className="skin-scan-container">
      <h2>AI Skin Scan</h2>
      <p>Position your face within the camera frame for instant analysis.</p>
    </div>
  );
}

// Main Routing Architecture
function App() {
  return (
    <div className="app-shell">
      {/* Navbar stays fixed across all page routes */}
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skin-scan" element={<SkinScanPage />} />
        <Route path="/dosha-test" element={<DoshaTestPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}



export default App;