import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAdminRemedy,
  deleteAdminRemedy,
  getAdminDashboard,
  getAdminInsights,
  getAdminRemedies,
  getAdminUserActivity,
  getAdminUsers,
  updateAdminRemedy,
} from "../utils/api";
import { formatSkinType, SKIN_TYPES } from "../utils/skinTypeInfo";
import "./AdminDashboard.css";

const EMPTY_REMEDY = {
  title: "",
  description: "",
  ingredients: "",
  instructions: "",
  benefits: "",
  importantNote: "",
  icon: "🌿",
  duration: "10 min",
  difficulty: "Easy",
  frequency: "Use 1–2 times per week",
  dosha: "",
  skinType: "",
  category: "",
};

const getFriendlyDosha = (dosha) => {
  const labels = {
    Vata: "Vata · Ayurvedic pattern",
    Pitta: "Pitta · Ayurvedic pattern",
    Kapha: "Kapha · Ayurvedic pattern",
  };

  return labels[dosha] || "Not available";
};

function AdminDashboard({ view = "dashboard" }) {
  const navigate = useNavigate();

  const isDashboardPage = view === "dashboard";
  const isUsersPage = view === "users";
  const isAssessmentsPage = view === "assessments";
  const isRemediesPage = view === "remedies";

  const [dashboard, setDashboard] = useState(null);
  const [insights, setInsights] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [activeInsight, setActiveInsight] = useState(null);

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] =
    useState(null);

  const [remedies, setRemedies] = useState([]);
  const [showRemedies, setShowRemedies] = useState(false);
  const [showRemedyForm, setShowRemedyForm] =
    useState(false);
  const [editingRemedy, setEditingRemedy] = useState(null);
  const [remedyForm, setRemedyForm] =
    useState(EMPTY_REMEDY);
  const [remedySuccess, setRemedySuccess] = useState("");

  const [loadingDashboard, setLoadingDashboard] =
    useState(true);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [, setLoadingUsers] = useState(false);
  const [loadingActivityId, setLoadingActivityId] =
    useState(null);
  const [loadingRemedies, setLoadingRemedies] =
    useState(false);
  const [savingRemedy, setSavingRemedy] = useState(false);
  const [deletingRemedyId, setDeletingRemedyId] =
    useState(null);

  const [error, setError] = useState("");

  const savedUser = localStorage.getItem("ayuraiUser");

  let adminUser = {
    name: "Administrator",
    email: "",
  };

  try {
    if (savedUser) {
      adminUser = JSON.parse(savedUser);
    }
  } catch {
    // Use the safe default if saved login details are unavailable.
  }

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoadingDashboard(true);
        setError("");

        const response = await getAdminDashboard();

        setDashboard(response);
      } catch (dashboardError) {
        setError(
          dashboardError.message ||
            "Unable to load dashboard information."
        );
      } finally {
        setLoadingDashboard(false);
      }
    };

    loadDashboard();
  }, []);

  // Load only the information needed for the selected admin page.
  useEffect(() => {
    const loadWorkspacePage = async () => {
      try {
        setError("");

        if (isUsersPage) {
          setLoadingUsers(true);
          setUsers(await getAdminUsers());
          setShowUsers(true);
        }

        if (isAssessmentsPage) {
          setLoadingInsights(true);
          setInsights(await getAdminInsights());
          setShowInsights(true);
        }

        if (isRemediesPage) {
          setLoadingRemedies(true);
          await loadRemedies();
          setShowRemedies(true);
        }
      } catch (workspaceError) {
        setError(
          workspaceError.message ||
            "Unable to load this administrator page."
        );
      } finally {
        setLoadingUsers(false);
        setLoadingInsights(false);
        setLoadingRemedies(false);
      }
    };

    loadWorkspacePage();
  }, [view, isUsersPage, isAssessmentsPage, isRemediesPage]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const role = (user.role || "").toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        role.includes(query) ||
        String(user.id).includes(query)
      );
    });
  }, [users, searchTerm]);

  const _handleUsersClick = async () => {
    if (showUsers) {
      setShowUsers(false);
      setSearchTerm("");
      setSelectedActivity(null);
      return;
    }

    try {
      setLoadingUsers(true);
      setError("");

      const response = await getAdminUsers();

      setUsers(response);
      setShowUsers(true);
    } catch (usersError) {
      setError(
        usersError.message ||
          "Unable to load registered users."
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleViewActivity = async (userId) => {
    try {
      setLoadingActivityId(userId);
      setError("");

      const response = await getAdminUserActivity(userId);

      setSelectedActivity(response);
    } catch (activityError) {
      setError(
        activityError.message ||
          "Unable to load this user's activity."
      );
    } finally {
      setLoadingActivityId(null);
    }
  };

  const _handleInsightsClick = async (insightType) => {
    if (showInsights && activeInsight === insightType) {
      setShowInsights(false);
      setActiveInsight(null);
      return;
    }

    try {
      setLoadingInsights(true);
      setError("");

      const response = insights || await getAdminInsights();

      setInsights(response);
      setActiveInsight(insightType);
      setShowInsights(true);
    } catch (insightsError) {
      setError(
        insightsError.message ||
          "Unable to load platform insights."
      );
    } finally {
      setLoadingInsights(false);
    }
  };

  const loadRemedies = async () => {
    const response = await getAdminRemedies();

    const orderedRemedies = [...response].sort((first, second) =>
      (first.title || "").localeCompare(second.title || "")
    );

    setRemedies(orderedRemedies);
  };

  const _handleRemediesClick = async () => {
    if (showRemedies) {
      setShowRemedies(false);
      setShowRemedyForm(false);
      setEditingRemedy(null);
      setRemedySuccess("");
      return;
    }

    try {
      setLoadingRemedies(true);
      setError("");
      setRemedySuccess("");

      await loadRemedies();

      setShowRemedies(true);
    } catch (remediesError) {
      setError(
        remediesError.message ||
          "Unable to load the remedy library."
      );
    } finally {
      setLoadingRemedies(false);
    }
  };

  const openCreateRemedy = () => {
    setEditingRemedy(null);
    setRemedyForm(EMPTY_REMEDY);
    setRemedySuccess("");
    setShowRemedyForm(true);
  };

  const openEditRemedy = (remedy) => {
    setEditingRemedy(remedy);

    setRemedyForm({
      title: remedy.title || "",
      description: remedy.description || "",
      ingredients: remedy.ingredients || "",
      instructions: remedy.instructions || "",
      benefits: remedy.benefits || "",
      importantNote: remedy.importantNote || "",
      icon: remedy.icon || "🌿",
      duration: remedy.duration || "10 min",
      difficulty: remedy.difficulty || "Easy",
      frequency: remedy.frequency || "Use 1–2 times per week",
      dosha: remedy.dosha || "",
      skinType: remedy.skinType || "",
      category: remedy.category || "",
    });

    setRemedySuccess("");
    setShowRemedyForm(true);
  };

  const closeRemedyForm = () => {
    setEditingRemedy(null);
    setRemedyForm(EMPTY_REMEDY);
    setShowRemedyForm(false);
  };

  const handleRemedyChange = (event) => {
    const { name, value } = event.target;

    setRemedyForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleRemedySubmit = async (event) => {
    event.preventDefault();

    if (!remedyForm.title.trim()) {
      setError("Please enter a remedy title.");
      return;
    }

    try {
      setSavingRemedy(true);
      setError("");
      setRemedySuccess("");

      if (editingRemedy) {
        await updateAdminRemedy(
          editingRemedy.id,
          remedyForm
        );

        setRemedySuccess("Remedy updated successfully.");
      } else {
        await createAdminRemedy(remedyForm);

        setRemedySuccess("New remedy added successfully.");
      }

      await loadRemedies();
      closeRemedyForm();
    } catch (saveError) {
      setError(
        saveError.message ||
          "Unable to save the remedy."
      );
    } finally {
      setSavingRemedy(false);
    }
  };

  const handleDeleteRemedy = async (remedy) => {
    const isConfirmed = window.confirm(
      `Remove "${remedy.title}" from the remedy library?\n\nThis cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      setDeletingRemedyId(remedy.id);
      setError("");
      setRemedySuccess("");

      await deleteAdminRemedy(remedy.id);
      await loadRemedies();

      setRemedySuccess("Remedy removed from the library.");

      if (editingRemedy?.id === remedy.id) {
        closeRemedyForm();
      }
    } catch (deleteError) {
      setError(
        deleteError.message ||
          "Unable to remove the remedy."
      );
    } finally {
      setDeletingRemedyId(null);
    }
  };

  const _handleLogout = () => {
    localStorage.removeItem("ayuraiUser");
    localStorage.removeItem("ayuraiUserId");
    localStorage.removeItem("ayuraiToken");

    navigate("/login", { replace: true });
  };

  const dashboardCards = [
    {
      number: "01",
      label: "Registered users",
      value: dashboard?.totalUsers,
      description:
        "Accounts currently registered in AyurAI.",
      color: "admin-card-gold",
      action: () => navigate("/admin/users"),
      actionText: "Manage users →",
    },
    {
      number: "02",
      label: "Skin scans",
      value: dashboard?.totalSkinScans,
      description:
        "Saved user skin-type profiles.",
      color: "admin-card-blue",
      action: () => navigate("/admin/assessments"),
      actionText: "View assessments →",
    },
    {
      number: "03",
      label: "Dosha tests",
      value: dashboard?.totalDoshaAssessments,
      description:
        "Completed skin-balance assessment responses.",
      color: "admin-card-pink",
      action: () => navigate("/admin/assessments"),
      actionText: "View assessments →",
    },
    {
      number: "04",
      label: "Overall results",
      value: dashboard?.totalOverallResults,
      description:
        "Combined skin scan and Dosha results.",
      color: "admin-card-green",
      action: () => navigate("/admin/assessments"),
      actionText: "View assessments →",
    },
  ];

  const _insightDetails = {
    skin: {
      eyebrow: "SKIN SCAN INSIGHTS",
      title: "Saved skin types",
      description:
        "Anonymous totals from user-selected skin scans.",
      counts: insights?.skinTypeCounts || {},
    },
    dosha: {
      eyebrow: "AYURVEDIC PATTERN INSIGHTS",
      title: "Completed wellness patterns",
      description:
        "Anonymous totals from completed Dosha Test results.",
      counts: insights?.doshaPatternCounts || {},
    },
    overall: {
      eyebrow: "OVERALL RESULT INSIGHTS",
      title: "Personalized results created",
      description:
        "A result is created only after both the Skin Scan and Dosha Test are complete.",
      counts: {
        "Completed overall results": insights?.totalOverallResults || 0,
      },
    },
  }[activeInsight];

  const pageHeading = {
    dashboard: {
      eyebrow: "AYURAI · ADMIN",
      title: `Welcome back, ${adminUser.name}`,
      description: "Manage the AyurAI wellness platform from one place.",
    },
    users: {
      eyebrow: "USER MANAGEMENT",
      title: "Registered users",
      description: "Review accounts and their safe, read-only activity summaries.",
    },
    assessments: {
      eyebrow: "ASSESSMENT INSIGHTS",
      title: "Skin and wellness activity",
      description: "Anonymous totals help you understand how the platform is being used.",
    },
    remedies: {
      eyebrow: "REMEDY LIBRARY",
      title: "Manage home remedies",
      description: "Create, update, and organize the self-care routines shown to users.",
    },
  }[view];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-brand">{pageHeading.eyebrow}</p>

          <h1>{pageHeading.title}</h1>

          <p className="admin-subtitle">
            {pageHeading.description}
          </p>
        </div>
      </header>

      {isDashboardPage && <section className="admin-status-card">
        <div>
          <span className="admin-status-dot" />
          <span>Administrator access is active</span>
        </div>

        <p>{adminUser.email}</p>
      </section>}

      {error && (
        <div className="admin-error" role="alert">
          {error}
        </div>
      )}

      {isDashboardPage && <section className="admin-overview">
        <div className="admin-section-heading">
          <p>LIVE PLATFORM OVERVIEW</p>
          <h2>AyurAI activity</h2>
        </div>

        <div className="admin-card-grid">
          {dashboardCards.map((card) => (
            <article
              key={card.label}
              className={`admin-card ${card.color}`}
            >
              <span className="admin-card-number">
                {card.number}
              </span>

              <h3>{card.label}</h3>

              <strong className="admin-card-value">
                {loadingDashboard ? "..." : card.value ?? "—"}
              </strong>

              <p>{card.description}</p>

              {card.action ? (
                <button
                  type="button"
                  className="admin-card-button"
                  onClick={card.action}
                  disabled={card.isLoading}
                >
                  {card.isLoading
                    ? "Loading..."
                    : card.actionText}
                </button>
              ) : (
                <span className="admin-card-tag">
                  Live data
                </span>
              )}
            </article>
          ))}
        </div>
      </section>}

      {isAssessmentsPage && (
        <section className="admin-assessments-section">
          {loadingInsights ? (
            <p className="admin-empty-insight">Loading assessment insights...</p>
          ) : (
            <div className="admin-assessment-grid">
              <article className="admin-insights-panel">
                <p>SKIN SCAN INSIGHTS</p>
                <h2>Saved skin types</h2>
                <span>Anonymous totals from user-selected skin scans.</span>
                <div className="admin-insight-counts">
                  {Object.entries(insights?.skinTypeCounts || {}).map(([label, count]) => (
                    <article key={label}><span>{formatSkinType(label)}</span><strong>{count}</strong></article>
                  ))}
                </div>
              </article>
              <article className="admin-insights-panel">
                <p>AYURVEDIC PATTERN INSIGHTS</p>
                <h2>Wellness patterns</h2>
                <span>Anonymous totals from completed Dosha Tests.</span>
                <div className="admin-insight-counts">
                  {Object.entries(insights?.doshaPatternCounts || {}).map(([label, count]) => (
                    <article key={label}><span>{getFriendlyDosha(label)}</span><strong>{count}</strong></article>
                  ))}
                </div>
              </article>
              <article className="admin-insights-panel admin-overall-insight">
                <p>OVERALL RESULT INSIGHTS</p>
                <h2>Personalized results created</h2>
                <span>Created after a user completes both required assessments.</span>
                <strong className="admin-insight-total">{insights?.totalOverallResults ?? dashboard?.totalOverallResults ?? 0}</strong>
              </article>
            </div>
          )}
          <p className="admin-privacy-note">These are anonymous platform totals. No photos, passwords, or private guidance are shown here.</p>
        </section>
      )}

      {isRemediesPage && <section className="admin-remedy-library">
        <div className="admin-remedy-library-copy">
          <p>REMEDY LIBRARY</p>

          <h2>Manage home remedies</h2>

          <span>
            Add, update, or remove the self-care remedies shown
            to AyurAI users.
          </span>
        </div>

        <button
          type="button"
          className="admin-remedy-library-button"
          onClick={openCreateRemedy}
          disabled={loadingRemedies}
        >
          {loadingRemedies
            ? "Loading remedies..."
            : "+ Add new remedy"}
        </button>
      </section>}

      {isRemediesPage && (
        <section className="admin-remedies-section">
          <div className="admin-remedies-heading">
            <div className="admin-section-heading">
              <p>ADMIN REMEDY MANAGEMENT</p>
              <h2>Home remedy library</h2>
            </div>

            <button
              type="button"
              className="admin-add-remedy-button"
              onClick={openCreateRemedy}
            >
              + Add new remedy
            </button>
          </div>

          {remedySuccess && (
            <div className="admin-success" role="status">
              {remedySuccess}
            </div>
          )}

          {showRemedyForm && (
            <form
              className="admin-remedy-form"
              onSubmit={handleRemedySubmit}
            >
              <div className="admin-form-heading">
                <div>
                  <p>
                    {editingRemedy
                      ? "EDIT REMEDY"
                      : "NEW REMEDY"}
                  </p>

                  <h3>
                    {editingRemedy
                      ? `Update ${editingRemedy.title}`
                      : "Add a home remedy"}
                  </h3>
                </div>

                <button
                  type="button"
                  className="admin-form-close"
                  onClick={closeRemedyForm}
                >
                  Close
                </button>
              </div>

              <div className="admin-form-grid">
                <label className="admin-form-wide">
                  Remedy title *
                  <input
                    type="text"
                    name="title"
                    value={remedyForm.title}
                    onChange={handleRemedyChange}
                    placeholder="Example: Aloe & Honey Hydration"
                    required
                  />
                </label>

                <label>
                  Skin concern
                  <select
                    name="category"
                    value={remedyForm.category}
                    onChange={handleRemedyChange}
                  >
                    <option value="">Choose a concern</option>
                    <option value="Acne">Acne</option>
                    <option value="Dryness">Dryness</option>
                    <option value="Dullness">Dullness</option>
                    <option value="Oiliness">Oiliness</option>
                    <option value="Sensitive Skin">Sensitive Skin</option>
                    <option value="Uneven Texture">Uneven Texture</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </label>

                <label>
                  Ayurvedic pattern
                  <select
                    name="dosha"
                    value={remedyForm.dosha}
                    onChange={handleRemedyChange}
                  >
                    <option value="">Choose a pattern</option>
                    <option value="Vata">Vata · Ayurvedic pattern</option>
                    <option value="Pitta">
                      Pitta · Ayurvedic pattern
                    </option>
                    <option value="Kapha">Kapha · Ayurvedic pattern</option>
                  </select>
                </label>

                <label>
                  Skin type
                  <select
                    name="skinType"
                    value={remedyForm.skinType}
                    onChange={handleRemedyChange}
                  >
                    <option value="">Any skin type</option>
                    {SKIN_TYPES.map((skinType) => (
                      <option key={skinType.value} value={skinType.value}>
                        {skinType.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Icon
                  <input
                    type="text"
                    name="icon"
                    value={remedyForm.icon}
                    onChange={handleRemedyChange}
                    placeholder="Example: 🌿"
                  />
                </label>

                <label>
                  Time needed
                  <input
                    type="text"
                    name="duration"
                    value={remedyForm.duration}
                    onChange={handleRemedyChange}
                    placeholder="Example: 10 min"
                  />
                </label>

                <label>
                  Difficulty
                  <select
                    name="difficulty"
                    value={remedyForm.difficulty}
                    onChange={handleRemedyChange}
                  >
                    <option value="Very Easy">Very Easy</option>
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </label>

                <label className="admin-form-wide">
                  Recommended frequency
                  <select
                    name="frequency"
                    value={remedyForm.frequency}
                    onChange={handleRemedyChange}
                  >
                    <option value="Use once per week">
                      Use once per week
                    </option>
                    <option value="Use 1–2 times per week">
                      Use 1–2 times per week
                    </option>
                    <option value="Use 2 times per week">
                      Use 2 times per week
                    </option>
                    <option value="Use when needed">
                      Use when needed
                    </option>
                  </select>
                </label>

                <label className="admin-form-wide">
                  Short description
                  <textarea
                    name="description"
                    value={remedyForm.description}
                    onChange={handleRemedyChange}
                    placeholder="Describe the gentle self-care idea."
                    rows="3"
                  />
                </label>

                <label className="admin-form-wide">
                  Ingredients (one item per line)
                  <textarea
                    name="ingredients"
                    value={remedyForm.ingredients}
                    onChange={handleRemedyChange}
                    placeholder={"1 tablespoon aloe gel\n1 teaspoon honey"}
                    rows="3"
                  />
                </label>

                <label className="admin-form-wide">
                  Benefits (one benefit per line)
                  <textarea
                    name="benefits"
                    value={remedyForm.benefits}
                    onChange={handleRemedyChange}
                    placeholder={"Helps skin feel soothed\nEasy to prepare\nSupports a gentle routine"}
                    rows="3"
                  />
                </label>

                <label className="admin-form-wide">
                  Animated ritual steps (one step per line)
                  <textarea
                    name="instructions"
                    value={remedyForm.instructions}
                    onChange={handleRemedyChange}
                    placeholder={"Mix the ingredients into a smooth paste.\nApply a thin layer to clean skin.\nLeave on for 10 minutes.\nRinse gently with cool water."}
                    rows="4"
                  />
                </label>

                <label className="admin-form-wide">
                  Safety note
                  <textarea
                    name="importantNote"
                    value={remedyForm.importantNote}
                    onChange={handleRemedyChange}
                    placeholder="Example: Patch test first. Do not use if you are allergic to any ingredient."
                    rows="2"
                  />
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-form-cancel"
                  onClick={closeRemedyForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-form-save"
                  disabled={savingRemedy}
                >
                  {savingRemedy
                    ? "Saving..."
                    : editingRemedy
                      ? "Save changes"
                      : "Add remedy"}
                </button>
              </div>
            </form>
          )}

          <p className="admin-remedy-count">
            {remedies.length} remedies in the library
          </p>

          <div className="admin-remedy-grid">
            {remedies.map((remedy) => (
              <article
                className="admin-remedy-card"
                key={remedy.id}
              >
                <div className="admin-remedy-card-top">
                  <span className="admin-remedy-category">
                    {remedy.category || "General care"}
                  </span>

                  <span className="admin-remedy-id">
                    #{remedy.id}
                  </span>
                </div>

                <h3>{remedy.title}</h3>

                <p>
                  {remedy.description ||
                    "No description has been added yet."}
                </p>

                <div className="admin-remedy-meta">
                  <span>
                    {getFriendlyDosha(remedy.dosha)}
                  </span>

                  <span>
                    {remedy.skinType || "Any skin type"}
                  </span>

                  <span>
                    {remedy.frequency || "Frequency not set"}
                  </span>
                </div>

                <div className="admin-remedy-actions">
                  <button
                    type="button"
                    className="admin-remedy-edit"
                    onClick={() => openEditRemedy(remedy)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-remedy-delete"
                    onClick={() => handleDeleteRemedy(remedy)}
                    disabled={deletingRemedyId === remedy.id}
                  >
                    {deletingRemedyId === remedy.id
                      ? "Removing..."
                      : "Remove"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {isUsersPage && (
        <section className="admin-users-section">
          <div className="admin-users-heading">
            <div className="admin-section-heading">
              <p>USER MANAGEMENT</p>
              <h2>Registered users</h2>
            </div>

            <div className="admin-search-wrap">
              <label htmlFor="admin-user-search">
                Search users
              </label>

              <input
                id="admin-user-search"
                type="search"
                placeholder="Name, email, role, or ID"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          </div>

          <p className="admin-user-count">
            Showing {filteredUsers.length} of {users.length} users
          </p>

          <div className="admin-users-table-wrap">
            <table className="admin-users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Role</th>
                  <th>Activity</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name || "—"}</td>
                    <td>{user.email}</td>
                    <td>{user.age ?? "—"}</td>
                    <td>
                      <span
                        className={`admin-role-badge ${
                          user.role === "ADMIN"
                            ? "admin-role-admin"
                            : "admin-role-user"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-activity-button"
                        onClick={() =>
                          handleViewActivity(user.id)
                        }
                        disabled={
                          loadingActivityId === user.id
                        }
                      >
                        {loadingActivityId === user.id
                          ? "Loading..."
                          : "View activity"}
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      className="admin-no-results"
                      colSpan="6"
                    >
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedActivity && (
            <section className="admin-activity-panel">
              <div className="admin-activity-heading">
                <div>
                  <p>READ-ONLY ACTIVITY SUMMARY</p>
                  <h2>{selectedActivity.name}</h2>
                  <span>{selectedActivity.email}</span>
                </div>

                <button
                  type="button"
                  className="admin-close-activity"
                  onClick={() => setSelectedActivity(null)}
                >
                  Close
                </button>
              </div>

              <div className="admin-activity-grid">
                <article>
                  <span>Skin scans</span>
                  <strong>
                    {selectedActivity.totalSkinScans}
                  </strong>
                </article>

                <article>
                  <span>Dosha tests</span>
                  <strong>
                    {selectedActivity.totalDoshaAssessments}
                  </strong>
                </article>

                <article>
                  <span>Overall results</span>
                  <strong>
                    {selectedActivity.totalOverallResults}
                  </strong>
                </article>
              </div>

              <div className="admin-latest-summary">
                <div>
                  <span>Latest skin type</span>
                  <strong>
                    {selectedActivity.latestEstimatedSkinType
                      ? formatSkinType(selectedActivity.latestEstimatedSkinType)
                      : "No skin scan saved"}
                  </strong>
                </div>

                <div>
                  <span>Latest skin scan status</span>
                  <strong>
                    {selectedActivity.latestAnalysisStatus ||
                      "Not available"}
                  </strong>
                </div>

                <div>
                  <span>Latest Ayurvedic pattern</span>
                  <strong>
                    {getFriendlyDosha(
                      selectedActivity.latestDominantDosha
                    )}
                  </strong>
                </div>
              </div>

              <p className="admin-privacy-note">
                This view is read-only and never displays
                passwords, uploaded photos, or detailed personal
                guidance.
              </p>
            </section>
          )}
        </section>
      )}

      {isDashboardPage && <section className="admin-next-step">
        <p>ADMIN MANAGEMENT</p>

        <h2>Live data is now connected.</h2>

        <span>
          You can securely manage remedies and review safe user
          activity without exposing passwords.
        </span>
      </section>}
    </main>
  );
}

export default AdminDashboard;
