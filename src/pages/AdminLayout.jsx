import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AdminLayout.css";

const navigationItems = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/assessments", label: "Assessments" },
  { to: "/admin/remedies", label: "Home Remedies" },
];

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("ayuraiUser");
    localStorage.removeItem("ayuraiUserId");
    localStorage.removeItem("ayuraiToken");
    navigate("/login", { replace: true });
  };

  return (
    <div className="admin-workspace">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span>AYUR</span><em>AI</em>
          <small>ADMIN WORKSPACE</small>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar-link ${isActive ? "active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span>Administrator area</span>
          <button type="button" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-workspace-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
