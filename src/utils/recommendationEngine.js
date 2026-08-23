/* =========================================================
   AYURAI — SKIN RECOMMENDATION ENGINE
   Ayurvedic-inspired recommendation system
   ========================================================= */


/* =========================================================
   NORMALIZE VALUES
   ========================================================= */

const normalize = (value) => {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase();
};


/* =========================================================
   DOSHA NORMALIZER
   ========================================================= */

const normalizeDosha = (dosha) => {

  const value = normalize(dosha);

  if (value.includes("vata")) {
    return "vata";
  }

  if (value.includes("pitta")) {
    return "pitta";
  }

  if (value.includes("kapha")) {
    return "kapha";
  }

  return null;
};


/* =========================================================
   SKIN TYPE NORMALIZER
   ========================================================= */

const normalizeSkinType = (skinType) => {

  const value = normalize(skinType);

  if (value.includes("dry")) {
    return "dry";
  }

  if (value.includes("oily")) {
    return "oily";
  }

  if (value.includes("sensitive")) {
    return "sensitive";
  }

  return "dry";
};


/* =========================================================
   CONCERN NORMALIZER
   ========================================================= */

const normalizeConcerns = (concerns) => {

  if (!Array.isArray(concerns)) {
    return [];
  }

  return concerns.map((concern) =>
    normalize(concern)
  );

};


/* =========================================================
   SKIN TYPE RECOMMENDATIONS
   ========================================================= */

const skinTypeRecommendations = {

  /* =======================================================
     DRY SKIN
     ======================================================= */

  dry: {

    summary:
      "Your skin appears to benefit from gentle hydration and moisture-supporting care. Focus on maintaining the skin barrier and avoiding overly harsh cleansing.",

    tips: [

      "Use a gentle cleanser and avoid very hot water.",

      "Apply a nourishing moisturizer while the skin is slightly damp.",

      "Choose soothing ingredients such as aloe vera or turmeric-inspired botanical care.",

      "Keep your daily skincare routine simple and consistent.",

      "Use sunscreen during daytime exposure."

    ]

  },


  /* =======================================================
     OILY SKIN
     ======================================================= */

  oily: {

    summary:
      "Your skin appears to benefit from lightweight hydration and balanced cleansing. Avoid over-cleansing because this can leave the skin feeling irritated.",

    tips: [

      "Use a gentle cleanser without excessive scrubbing.",

      "Choose lightweight, non-heavy moisturizers.",

      "Keep the skincare routine simple and consistent.",

      "Avoid frequently touching or squeezing visible blemishes.",

      "Use sunscreen suitable for your skin type."

    ]

  },


  /* =======================================================
     SENSITIVE SKIN
     ======================================================= */

  sensitive: {

    summary:
      "Your skin appears to benefit from a gentle and minimal routine focused on comfort and barrier support.",

    tips: [

      "Introduce new skincare products one at a time.",

      "Avoid aggressive scrubbing and harsh exfoliation.",

      "Choose gentle, fragrance-free products where possible.",

      "Use a calming moisturizer to support the skin barrier.",

      "Patch-test new products before applying them broadly."

    ]

  }

};


/* =========================================================
   DOSHA RECOMMENDATIONS
   ========================================================= */

const doshaRecommendations = {

  /* =======================================================
     VATA
     ======================================================= */

  vata: {

    summary:
      "Vata-inspired care focuses on nourishing, grounding and moisture-supporting skincare.",

    tips: [

      "Prioritize gentle cleansing and regular moisturization.",

      "Choose nourishing botanical ingredients.",

      "Avoid excessively drying skincare routines.",

      "Keep your skincare routine consistent."

    ]

  },


  /* =======================================================
     PITTA
     ======================================================= */

  pitta: {

    summary:
      "Pitta-inspired care focuses on calming and soothing the skin while avoiding excessive irritation.",

    tips: [

      "Prefer gentle and cooling skincare routines.",

      "Avoid excessive heat and aggressive exfoliation.",

      "Choose soothing botanical ingredients.",

      "Protect your skin from strong sun exposure."

    ]

  },


  /* =======================================================
     KAPHA
     ======================================================= */

  kapha: {

    summary:
      "Kapha-inspired care focuses on maintaining a fresh, balanced and lightweight skincare routine.",

    tips: [

      "Use gentle cleansing to remove excess surface oil.",

      "Prefer lightweight moisturizers.",

      "Avoid unnecessarily heavy skincare layers.",

      "Keep your skincare routine consistent."

    ]

  }

};


/* =========================================================
   CONCERN-SPECIFIC TIPS
   ========================================================= */

const concernRecommendations = {

  /* -------------------------------------------------------
     DRYNESS
     ------------------------------------------------------- */

  dryness: [

    "Support hydration with a gentle moisturizer.",

    "Avoid excessive cleansing and hot water."

  ],


  /* -------------------------------------------------------
     BLEMISH
     ------------------------------------------------------- */

  blemish: [

    "Avoid squeezing or picking visible blemishes.",

    "Keep products and skincare tools clean."

  ],


  /* -------------------------------------------------------
     ACNE
     ------------------------------------------------------- */

  acne: [

    "Avoid picking or squeezing acne-prone areas.",

    "Use a gentle cleansing routine and avoid harsh scrubbing."

  ],


  /* -------------------------------------------------------
     REDNESS
     ------------------------------------------------------- */

  redness: [

    "Avoid aggressive exfoliation.",

    "Choose gentle products and monitor how your skin responds."

  ],


  /* -------------------------------------------------------
     DEHYDRATION
     ------------------------------------------------------- */

  dehydration: [

    "Use a moisturizer after cleansing.",

    "Avoid unnecessarily harsh cleansing."

  ],


  /* -------------------------------------------------------
     OILINESS
     ------------------------------------------------------- */

  oiliness: [

    "Use lightweight skincare products.",

    "Avoid repeatedly washing the skin throughout the day."

  ],


  /* -------------------------------------------------------
     SENSITIVITY
     ------------------------------------------------------- */

  sensitivity: [

    "Introduce new skincare products gradually.",

    "Avoid unnecessary fragrance and harsh exfoliation."

  ]

};


/* =========================================================
   FIND CONCERN MATCH
   ========================================================= */

const getConcernTips = (concerns) => {

  const matchedTips = [];

  concerns.forEach((concern) => {

    Object.keys(concernRecommendations).forEach(
      (keyword) => {

        if (concern.includes(keyword)) {

          concernRecommendations[keyword]
            .forEach((tip) => {

              if (!matchedTips.includes(tip)) {
                matchedTips.push(tip);
              }

            });

        }

      }
    );

  });

  return matchedTips;

};


/* =========================================================
   REMOVE DUPLICATES
   ========================================================= */

const removeDuplicates = (items) => {

  return [
    ...new Set(
      items.filter(Boolean)
    )
  ];

};


/* =========================================================
   MAIN RECOMMENDATION FUNCTION
   ========================================================= */

export const generateRecommendation = ({
  dosha = null,
  skinType = "Dry",
  concerns = []
}) => {

  /* =======================================================
     NORMALIZE INPUT
     ======================================================= */

  const normalizedDosha =
    normalizeDosha(dosha);

  const normalizedSkinType =
    normalizeSkinType(skinType);

  const normalizedConcerns =
    normalizeConcerns(concerns);


  /* =======================================================
     GET SKIN TYPE DATA
     ======================================================= */

  const skinRecommendation =
    skinTypeRecommendations[
      normalizedSkinType
    ] ||
    skinTypeRecommendations.dry;


  /* =======================================================
     GET DOSHA DATA
     ======================================================= */

  const doshaRecommendation =
    normalizedDosha
      ? doshaRecommendations[
          normalizedDosha
        ]
      : null;


  /* =======================================================
     GET CONCERN TIPS
     ======================================================= */

  const concernTips =
    getConcernTips(
      normalizedConcerns
    );


  /* =======================================================
     COMBINE TIPS
     ======================================================= */

  const combinedTips = removeDuplicates([

    ...skinRecommendation.tips,

    ...(doshaRecommendation
      ? doshaRecommendation.tips
      : []),

    ...concernTips

  ]);


  /* =======================================================
     LIMIT DISPLAY TIPS
     ======================================================= */

  const finalTips =
    combinedTips.slice(0, 6);


  /* =======================================================
     CREATE SUMMARY
     ======================================================= */

  let summary =
    skinRecommendation.summary;


  /* =======================================================
     ADD DOSHA CONTEXT
     ======================================================= */

  if (doshaRecommendation) {

    summary =
      `${skinRecommendation.summary} ${doshaRecommendation.summary}`;

  }


  /* =======================================================
     ADD CONCERN CONTEXT
     ======================================================= */

  if (normalizedConcerns.length > 0) {

    summary +=
      " The suggested routine also considers the visible characteristics identified in your uploaded image.";

  }


  /* =======================================================
     RETURN RESULT
     ======================================================= */

  return {

    summary,

    tips: finalTips,

    dosha:
      normalizedDosha
        ? normalizedDosha.toUpperCase()
        : null,

    skinType:
      skinType
        ? skinType
        : "Dry",

    concerns:
      concerns

  };

};


/* =========================================================
   QUICK PROFILE GENERATOR
   ========================================================= */

export const generateSkinProfile = ({
  dosha = null,
  skinType = "Dry",
  concerns = [],
  hydration = 68,
  confidence = 86
}) => {

  const recommendation =
    generateRecommendation({

      dosha,

      skinType,

      concerns

    });


  return {

    skinType,

    hydration: {

      level:
        hydration >= 75
          ? "Good hydration appearance"
          : hydration >= 50
            ? "Moderate hydration appearance"
            : "Lower hydration appearance",

      percentage:
        hydration

    },

    concerns,

    confidence,

    recommendation:
      recommendation.summary,

    careTips:
      recommendation.tips,

    dosha:
      recommendation.dosha,

    completedAt:
      new Date().toISOString()

  };

};


/* =========================================================
   EXPORT DEFAULT
   ========================================================= */

export default generateRecommendation;