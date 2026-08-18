import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ id, name, description, price }) {
  return (
    <div className="product-card">
      <h3>{name}</h3>
      <p>{description}</p>
      <span>{price}</span>
      {/* Dynamic route navigation */}
      <Link to={`/product/${id}`} className="view-details-btn">
        View Details
      </Link>
    </div>
  );
}

export default ProductCard;