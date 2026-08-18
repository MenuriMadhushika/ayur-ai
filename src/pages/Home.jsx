function Home() {
  return (
    <main className="home-container">
      <Hero />
      <div className="quick-actions-grid">
        <SkinScanCard />
        <DoshaSelector />
      </div>

      <section className="featured-products">
        <h2 className="section-title">Recommended For You</h2>
        <div className="product-list">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </main>
  );
}