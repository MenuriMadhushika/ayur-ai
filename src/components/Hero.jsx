function Hero() {

  function handleStart() {
    alert("Let's start your Ayurvedic analysis!");
  }

  return (
    <section>
      <h1>DISCOVER YOUR SKIN BALANCE</h1>

      <p>
        AI-powered Ayurvedic skincare personalized for you.
      </p>

      <button onClick={handleStart}>
        Discover My Skin
      </button>
    </section>
  );
}

export default Hero;