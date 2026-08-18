import React, { useState } from "react";

// --- Custom Gold SVG Icons ---
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A24A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C9A24A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#063B2A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Sample AyurAI Product Dataset ---
const productsData = [
  {
    id: 1,
    name: "White Mint Facial Cleanser",
    dosha: "Pitta",
    concern: "Redness & Sensitivity",
    price: "LKR 4,800",
    rating: 4.9,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=White+Mint+Cleanser",
    description: "Deeply cleanses and cools inflamed skin while relieving redness and irritation.",
  },
  {
    id: 2,
    name: "Sandalwood Deep Hydration Day Cream",
    dosha: "Vata",
    concern: "Dryness & Dehydration",
    price: "LKR 6,200",
    rating: 4.8,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=Sandalwood+Cream",
    description: "Locks in intense moisture, restores elastic resilience, and protects dry skin barriers.",
  },
  {
    id: 3,
    name: "Neem & Tea Tree Clarifying Facial Wash",
    dosha: "Kapha",
    concern: "Oil & Acne",
    price: "LKR 4,500",
    rating: 4.7,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=Neem+Clarifying+Wash",
    description: "Purifies congested skin, removes excess sebum, and minimizes enlarged pores.",
  },
  {
    id: 4,
    name: "True Turmeric Soothing Facial Serum",
    dosha: "Pitta",
    concern: "Redness & Sensitivity",
    price: "LKR 7,500",
    rating: 5.0,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=Turmeric+Serum",
    description: "Potent botanical antioxidant serum designed to even tone and reduce stress flare-ups.",
  },
  {
    id: 5,
    name: "Precious Oils Rejuvenating Night Elixir",
    dosha: "Vata",
    concern: "Fine Lines & Aging",
    price: "LKR 8,900",
    rating: 4.9,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=Precious+Oils+Elixir",
    description: "Overnight nourishing oil treatment enriched with traditional Ayurvedic essential oils.",
  },
  {
    id: 6,
    name: "Ceylon Green Tea Mattifying Toner",
    dosha: "Kapha",
    concern: "Oil & Acne",
    price: "LKR 3,900",
    rating: 4.6,
    image: "https://via.placeholder.com/250x250/04291D/C9A24A?text=Green+Tea+Toner",
    description: "Refreshes and balances skin pH while controlling excess daytime shine.",
  },
];

const Products = () => {
  const [selectedDosha, setSelectedDosha] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConcern, setSelectedConcern] = useState("All");

  // Filter Logic
  const filteredProducts = productsData.filter((product) => {
    const matchesDosha = selectedDosha === "All" || product.dosha === selectedDosha;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesConcern = selectedConcern === "All" || product.concern === selectedConcern;

    return matchesDosha && matchesSearch && matchesConcern;
  });

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.badge}>AyurAI BOTANICALS</span>
        <h1 style={styles.title}>Prescribed Ayurvedic Remedies</h1>
        <p style={styles.subtitle}>
          Formulated to harmonize your unique skin Dosha with pure Ceylon essential oils and botanical actives.
        </p>
      </div>

      {/* Control Bar: Search & Dosha Filter Tabs */}
      <div style={styles.controlBar}>
        {/* Search Box */}
        <div style={styles.searchWrapper}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search remedies, ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Dosha Category Tabs */}
        <div style={styles.tabContainer}>
          {["All", "Pitta", "Vata", "Kapha"].map((dosha) => (
            <button
              key={dosha}
              style={{
                ...styles.tabBtn,
                ...(selectedDosha === dosha ? styles.activeTabBtn : {}),
              }}
              onClick={() => setSelectedDosha(dosha)}
            >
              {dosha === "All" ? "All Remedies" : `${dosha} Rituals`}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Filter: Skin Concern Filter */}
      <div style={styles.secondaryFilterBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FilterIcon />
          <span style={styles.filterLabel}>Target Concern:</span>
        </div>
        <select
          value={selectedConcern}
          onChange={(e) => setSelectedConcern(e.target.value)}
          style={styles.selectInput}
        >
          <option value="All">All Skin Concerns</option>
          <option value="Redness & Sensitivity">Redness & Sensitivity</option>
          <option value="Dryness & Dehydration">Dryness & Dehydration</option>
          <option value="Oil & Acne">Oil & Acne</option>
          <option value="Fine Lines & Aging">Fine Lines & Aging</option>
        </select>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <div key={product.id} style={styles.productCard}>
              <div style={styles.imageContainer}>
                <span style={styles.doshaBadge}>{product.dosha}</span>
                <img src={product.image} alt={product.name} style={styles.productImage} />
              </div>

              <div style={styles.cardContent}>
                <span style={styles.concernTag}>{product.concern}</span>
                <h3 style={styles.productTitle}>{product.name}</h3>
                <p style={styles.productDesc}>{product.description}</p>

                <div style={styles.cardFooter}>
                  <div>
                    <span style={styles.productPrice}>{product.price}</span>
                    <div style={styles.ratingText}>★ {product.rating}</div>
                  </div>

                  <button style={styles.addBtn} title="Add to Daily Routine">
                    <PlusIcon /> Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noResults}>
          <p>No Ayurvedic remedies found matching your selected filters.</p>
          <button
            style={styles.resetBtn}
            onClick={() => {
              setSelectedDosha("All");
              setSearchQuery("");
              setSelectedConcern("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

// Inline Styles matching Deep Green (#063B2A), Cream (#F8F3E8), and Gold (#C9A24A)
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    color: "#F8F3E8",
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
  },
  badge: {
    fontSize: "11px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#C9A24A",
    fontWeight: "700",
  },
  title: {
    fontSize: "32px",
    color: "#F8F3E8",
    margin: "8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "rgba(248, 243, 232, 0.7)",
    maxWidth: "600px",
    margin: "0 auto",
  },
  controlBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(6, 59, 42, 0.7)",
    border: "1px solid rgba(201, 162, 74, 0.3)",
    borderRadius: "8px",
    padding: "10px 16px",
    flex: "1 1 300px",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F8F3E8",
    fontSize: "14px",
    width: "100%",
  },
  tabContainer: {
    display: "flex",
    gap: "8px",
    background: "rgba(4, 41, 29, 0.5)",
    padding: "4px",
    borderRadius: "8px",
    border: "1px solid rgba(201, 162, 74, 0.2)",
  },
  tabBtn: {
    background: "transparent",
    border: "none",
    color: "rgba(248, 243, 232, 0.7)",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  activeTabBtn: {
    background: "#C9A24A",
    color: "#063B2A",
  },
  secondaryFilterBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    marginBottom: "28px",
  },
  filterLabel: {
    fontSize: "13px",
    color: "#C9A24A",
    fontWeight: "600",
  },
  selectInput: {
    background: "rgba(6, 59, 42, 0.8)",
    border: "1px solid rgba(201, 162, 74, 0.3)",
    color: "#F8F3E8",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  productCard: {
    background: "rgba(6, 59, 42, 0.65)",
    border: "1px solid rgba(201, 162, 74, 0.25)",
    borderRadius: "14px",
    overflow: "hidden",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "200px",
    background: "#04291D",
  },
  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  doshaBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#C9A24A",
    color: "#063B2A",
    fontSize: "11px",
    fontWeight: "800",
    padding: "4px 10px",
    borderRadius: "20px",
    textTransform: "uppercase",
  },
  cardContent: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  concernTag: {
    fontSize: "11px",
    color: "#C9A24A",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  productTitle: {
    fontSize: "18px",
    margin: "0 0 8px 0",
    color: "#F8F3E8",
  },
  productDesc: {
    fontSize: "13px",
    color: "rgba(248, 243, 232, 0.7)",
    margin: "0 0 16px 0",
    lineHeight: "1.4",
    flexGrow: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid rgba(201, 162, 74, 0.15)",
  },
  productPrice: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#C9A24A",
  },
  ratingText: {
    fontSize: "12px",
    color: "rgba(248, 243, 232, 0.6)",
  },
  addBtn: {
    background: "#C9A24A",
    border: "none",
    color: "#063B2A",
    padding: "8px 14px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  noResults: {
    textAlign: "center",
    padding: "60px 20px",
    color: "rgba(248, 243, 232, 0.7)",
  },
  resetBtn: {
    background: "transparent",
    border: "1px solid #C9A24A",
    color: "#C9A24A",
    padding: "8px 18px",
    borderRadius: "6px",
    marginTop: "12px",
    cursor: "pointer",
  },
};

export default Products;