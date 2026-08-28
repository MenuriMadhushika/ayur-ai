import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAdminDashboard,
  getAdminUserActivity,
  getAdminUsers,
} from "../utils/api";
import "./AdminDashboard.css";

// Friendly labels make Dosha words easier to understand.
const getFriendlyDosha = (dosha) => {
  const labels = {
    Vata: "Vata · Dry",
    Pitta: "Pitta · Sensitive",
    Kapha: "Kapha · Oily",
  };

  return labels[dosha] || "Not available";
};

function AdminDashboard() {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Selected user's safe activity summary.
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [loadingDashboard, setLoadingDashboard] =
    useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingActivityId, setLoadingActivityId] =
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
    // Keep the safe default if local data is unavailable.
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

  const handleUsersClick = async () => {
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

  // Loads one privacy-conscious activity summary.
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

  const handleLogout = () => {
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
      isUsersCard: true,
    },
    {
      number: "02",
      label: "Skin scans",
      value: dashboard?.totalSkinScans,
      description:
        "Saved AI-estimated skin scan assessments.",
      color: "admin-card-blue",
    },
    {
      number: "03",
      label: "Dosha tests",
      value: dashboard?.totalDoshaAssessments,
      description:
        "Completed skin-balance assessment responses.",
      color: "admin-card-pink",
    },
    {
      number: "04",
      label: "Overall results",
      value: dashboard?.totalOverallResults,
      description:
        "Combined skin scan and Dosha results.",
      color: "admin-card-green",
    },
  ];

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="admin-brand">AYURAI · ADMIN</p>

          <h1>Welcome back, {adminUser.name}</h1>

          <p className="admin-subtitle">
            Manage the AyurAI wellness platform from one place.
          </p>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      <section className="admin-status-card">
        <div>
          <span className="admin-status-dot" />
          <span>Administrator access is active</span>
        </div>

        <p>{adminUser.email}</p>
      </section>

      <section className="admin-overview">
        <div className="admin-section-heading">
          <p>LIVE PLATFORM OVERVIEW</p>
          <h2>AyurAI activity</h2>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

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

              {card.isUsersCard ? (
                <button
                  type="button"
                  className="admin-card-button"
                  onClick={handleUsersClick}
                  disabled={loadingUsers}
                >
                  {loadingUsers
                    ? "Loading users..."
                    : showUsers
                      ? "Hide user list"
                      : "View user list →"}
                </button>
              ) : (
                <span className="admin-card-tag">
                  Live data
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      {showUsers && (
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
                  <span>Latest estimated skin type</span>
                  <strong>
                    {selectedActivity.latestEstimatedSkinType ||
                      "No skin scan saved"}
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
                  <span>Latest skin balance pattern</span>
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

      <section className="admin-next-step">
        <p>ADMIN MANAGEMENT</p>

        <h2>Live data is now connected.</h2>

        <span>
          You can securely find registered accounts and review
          safe activity summaries without exposing passwords.
        </span>
      </section>
    </main>
  );
}

export default AdminDashboard;