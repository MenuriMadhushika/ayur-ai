import products from "../data/products";

function ProductRecommendations({ dosha }) {
  const recommendedProducts = products.filter(
    (product) => product.dosha === dosha.toLowerCase()
  );

  return (
    <section className="recommendations">

      <div className="recommendation-header">
        <span className="recommendation-label">
          PERSONALIZED RITUAL
        </span>

        <h2>
          Curated for Your{" "}
          <span>{dosha} Dosha</span>
        </h2>

        <p>
          Discover carefully selected skincare rituals designed
          around your Ayurvedic skin profile.
        </p>
      </div>

      <div className="product-grid">

        {recommendedProducts.map((product) => (

          <article className="recommendation-card" key={product.id}>

            <div className="product-image-placeholder">
              <span>AyurAI</span>
            </div>

            <div className="recommendation-info">

              <span className="product-category">
                AYURVEDIC SKINCARE
              </span>

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <div className="product-bottom">

                <strong>{product.price}</strong>

                <button>
                  View Details →
                </button>

              </div>

            </div>

          </article>

        ))}

      </div>

    </section>
  );
}

export default ProductRecommendations;