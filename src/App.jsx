import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoshaSelector from "./components/DoshaSelector";
import SkinScanCard from "./components/SkinScanCard";
import ProductCard from "./components/ProductCard";
import ProductDetails from "./components/ProductDetails";
import DoshaQuestion from "./components/DoshaQuestion";
import UserProfile from "./components/UserProfile";

const products = [
  {
    id: 1,
    name: "Virgin Coconut Body Oil",
    dosha: "vata",
    description: "Deeply nourishing care for dry and dehydrated skin.",
    image: "/images/coconut-oil.jpg",
  },
  {
    id: 2,
    name: "Neem & Turmeric Face Care",
    dosha: "pitta",
    description: "Gentle Ayurvedic care for sensitive skin.",
    image: "/images/neem.jpg",
  },
  {
    id: 3,
    name: "Sandalwood Face Care",
    dosha: "kapha",
    description: "Refreshing care for oily and congested skin.",
    image: "/images/sandalwood.jpg",
  },
];

function Home() {
  const goToSkinAnalysis = () => {
    const section = document.getElementById("skin-scan");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="app">
      <Navbar />

      <main>
        <Hero />

        {/* AYURVEDIC SKIN BALANCE */}
        <section className="intro-section">
          <div className="section-label">
            AYURVEDIC SKINCARE
          </div>

          <h2>
            Discover Your Ayurvedic Skin Balance
          </h2>

          <p className="section-description">
            Ayurveda describes three natural energies called Doshas.
            Discover yours and understand what your skin truly needs.
          </p>

          <DoshaSelector />
        </section>


        {/* AI SKIN ANALYSIS */}
        <SkinScanCard />


        {/* PERSONALIZED CARE */}
        <section className="personalized-section">
          <div className="personalized-content">

            <span className="section-label">
              PERSONALIZED CARE
            </span>

            <h2>
              Beauty Guided by Ayurveda
            </h2>

            <p>
              AyurAI combines Ayurvedic principles with intelligent
              technology to help you discover skincare that fits your
              unique skin balance.
            </p>

            <div className="feature-row">

              <div>
                <span className="feature-number">
                  01
                </span>

                <h3>
                  Discover
                </h3>

                <p>
                  Understand your Ayurvedic skin type.
                </p>
              </div>

              <div>
                <span className="feature-number">
                  02
                </span>

                <h3>
                  Analyse
                </h3>

                <p>
                  Use AI-powered skin analysis.
                </p>
              </div>

              <div>
                <span className="feature-number">
                  03
                </span>

                <h3>
                  Personalize
                </h3>

                <p>
                  Receive skincare recommendations.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* PRODUCTS */}
        <section className="products-section">

          <div className="section-label">
            CURATED FOR YOU
          </div>

          <h2>
            Ayurvedic Skincare Collection
          </h2>

          <p className="section-description">
            Explore carefully selected products based on your skin needs.
          </p>

          <div className="products-grid">

            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        </section>

      </main>


      {/* FOOTER */}
      <footer className="footer">

        <div>

          <h2>
            AyurAI
          </h2>

          <p>
            Intelligent skincare inspired by the wisdom of Ayurveda.
          </p>

        </div>

        <div className="footer-right">
          <span>
            AI • AYURVEDA • BEAUTY
          </span>
        </div>

      </footer>

    </div>
  );
}


function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/dosha-test"
        element={<DoshaQuestion />}
      />

      <Route
        path="/products"
        element={<ProductCard />}
      />

      <Route
        path="/product/:id"
        element={<ProductDetails />}
      />

      <Route
  path="/profile"
  element={<UserProfile />}
/>
      

    </Routes>
  );
}

export default App;