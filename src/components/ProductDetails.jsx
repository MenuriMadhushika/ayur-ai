import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <Link to="/dosha-test">
          Back to Recommendations
        </Link>
      </div>
    );
  }

  return (
    <main className="product-details-page">

      <Link to="/dosha-test" className="back-link">
        ← Back to Recommendations
      </Link>

      <div className="product-details-card">

        <div className="product-details-image">
          <span>AyurAI</span>
        </div>

        <div className="product-details-info">

          <span className="product-category">
            AYURVEDIC SKINCARE
          </span>

          <h1>{product.name}</h1>

          <p className="product-price">
            {product.price}
          </p>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-benefits">
            <h3>Why We Recommend It</h3>

            <ul>
              <li>Designed for personalized skincare</li>
              <li>Inspired by Ayurvedic wellness</li>
              <li>Selected based on your skin profile</li>
            </ul>
          </div>

          <button className="shop-button">
            Shop Product →
          </button>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;