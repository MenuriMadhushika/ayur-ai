const USER_KEY = "ayuraiUser";

/* =========================================================
   SAVE CURRENT USER
========================================================= */

export const saveCurrentUser = (user) => {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );

  if (user?.id) {
    localStorage.setItem(
      "ayuraiUserId",
      String(user.id)
    );
  }
};


/* =========================================================
   GET CURRENT USER
========================================================= */

export const getCurrentUser = () => {

  const storedUser =
    localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {

    console.error(
      "Unable to read AyurAI user:",
      error
    );

    localStorage.removeItem(USER_KEY);

    return null;
  }
};


/* =========================================================
   GET CURRENT USER ID
========================================================= */

export const getCurrentUserId = () => {

  const user = getCurrentUser();

  if (user?.id) {
    return Number(user.id);
  }

  const storedId =
    localStorage.getItem("ayuraiUserId");

  if (storedId) {
    return Number(storedId);
  }

  return null;
};


/* =========================================================
   CLEAR CURRENT USER
========================================================= */

export const clearCurrentUser = () => {

  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("ayuraiUserId");
  localStorage.removeItem("ayuraiToken");

};
