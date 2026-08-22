// =====================================================
// AYURAI — RECOMMENDATION ENGINE
// =====================================================

// =====================================================
// NORMALIZE VALUES
// =====================================================

const normalize = (value) => {

  if (!value) {
    return "";
  }

  return value
    .toString()
    .trim()
    .toLowerCase();

};


// =====================================================
// DOSHA CARE
// =====================================================

const doshaCare = {

  vata: {

    focus:
      "hydration and gentle nourishment",

    tips: [
      "Use a gentle cleanser and avoid over-cleansing.",
      "Choose a nourishing moisturizer to help maintain skin comfort.",
      "Prefer simple skincare routines with minimal irritation."
    ]

  },


  pitta: {

    focus:
      "calming and cooling care",

    tips: [
      "Choose gentle, fragrance-free skincare where possible.",
      "Avoid very hot water and harsh exfoliation.",
      "Use soothing hydration to support skin comfort."
    ]

  },


  kapha: {

    focus:
      "light cleansing and balance",

    tips: [
      "Use a gentle cleanser to remove excess oil.",
      "Choose lightweight, non-comedogenic hydration.",
      "Avoid repeatedly washing the skin to remove oil."
    ]

  }

};


// =====================================================
// SKIN TYPE CARE
// =====================================================

const skinCare = {

  dry: {

    focus:
      "hydration and moisture support",

    tips: [
      "Apply moisturizer after cleansing.",
      "Avoid harsh cleansers that may increase dryness.",
      "Use lukewarm rather than very hot water."
    ]

  },


  sensitive: {

    focus:
      "calming and barrier-friendly care",

    tips: [
      "Keep your routine simple and gentle.",
      "Avoid strong fragrances and harsh scrubs.",
      "Introduce new products one at a time."
    ]

  },


  oily: {

    focus:
      "oil balance and lightweight hydration",

    tips: [
      "Use a gentle cleanser rather than aggressive oil-stripping products.",
      "Choose lightweight, non-comedogenic moisturizer.",
      "Avoid repeatedly cleansing the face throughout the day."
    ]

  }

};


// =====================================================
// CONCERN CARE
// =====================================================

const concernCare = {

  dryness: {
    tip:
      "Support dry-looking areas with gentle hydration and moisturizer."
  },

  blemish: {
    tip:
      "Keep the routine gentle and avoid picking or squeezing visible blemishes."
  },

  redness: {
    tip:
      "Focus on calming care and avoid harsh exfoliation."
  },

  sensitivity: {
    tip:
      "Use a simple routine and avoid introducing several new products at once."
  },

  oiliness: {
    tip:
      "Use lightweight hydration while maintaining gentle cleansing."
  },

  clogged: {
    tip:
      "Avoid heavy products if your skin tends to feel congested."
  }

};


// =====================================================
// FIND CONCERN MATCH
// =====================================================

const getConcernTips = (concerns = []) => {

  const tips = [];

  concerns.forEach((concern) => {

    const value =
      normalize(concern);

    Object.keys(concernCare).forEach(
      (keyword) => {

        if (
          value.includes(keyword) &&
          !tips.includes(
            concernCare[keyword].tip
          )
        ) {

          tips.push(
            concernCare[keyword].tip
          );

        }

      }
    );

  });

  return tips;

};


// =====================================================
// GENERATE RECOMMENDATION
// =====================================================

export const generateRecommendation = ({
  dosha,
  skinType,
  concerns = []
}) => {

  const normalizedDosha =
    normalize(dosha);

  const normalizedSkinType =
    normalize(skinType);


  // ===================================================
  // GET DOSHA DATA
  // ===================================================

  const doshaData =
    doshaCare[normalizedDosha] ||
    doshaCare.vata;


  // ===================================================
  // GET SKIN TYPE DATA
  // ===================================================

  const skinData =
    skinCare[normalizedSkinType] ||
    skinCare.dry;


  // ===================================================
  // CONCERN TIPS
  // ===================================================

  const concernTips =
    getConcernTips(concerns);


  // ===================================================
  // COMBINE TIPS
  // ===================================================

  const combinedTips = [

    ...doshaData.tips,

    ...skinData.tips,

    ...concernTips

  ];


  // ===================================================
  // REMOVE DUPLICATES
  // ===================================================

  const uniqueTips =
    [...new Set(combinedTips)];


  // ===================================================
  // LIMIT DISPLAY
  // ===================================================

  const finalTips =
    uniqueTips.slice(0, 6);


  // ===================================================
  // SUMMARY
  // ===================================================

  let summary;


  if (normalizedDosha && normalizedSkinType) {

    summary =
      `Your ${normalizedDosha.charAt(0).toUpperCase() + normalizedDosha.slice(1)}-aligned profile with ${normalizedSkinType} skin suggests focusing on ${doshaData.focus} together with ${skinData.focus}.`;

  } else if (normalizedDosha) {

    summary =
      `Your Ayurvedic profile appears aligned with ${normalizedDosha}. Focus on ${doshaData.focus}.`;

  } else if (normalizedSkinType) {

    summary =
      `Your skin appears aligned with a ${normalizedSkinType} skin pattern. Focus on ${skinData.focus}.`;

  } else {

    summary =
      "A gentle and consistent skincare routine may help support your skin."

  }


  // ===================================================
  // RETURN
  // ===================================================

  return {

    summary,

    tips: finalTips,

    dosha:
      normalizedDosha || null,

    skinType:
      normalizedSkinType || null,

    concerns

  };

};


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default generateRecommendation;