import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LayoutDashboard, TrendingUp, Wallet, Users, ShieldCheck, History, LogOut, Sun, Moon, Settings, Cog, Lock } from "lucide-react";
import ConciergeWidget from "@/components/ConciergeWidget";

const navItems = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/plans", label: "Invest", icon: TrendingUp },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/transactions", label: "Transactions", icon: History },
  { to: "/app/referrals", label: "Referrals", icon: Users },
  { to: "/app/kyc", label: "KYC", icon: ShieldCheck },
  { to: "/app/security", label: "Security", icon: Lock },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate("/"); };

  if (!user) return null;
  const isAdmin = user.role === "admin" || user.role === "super_admin";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-secondary/30">
        <Link to="/" className="px-6 py-7 border-b border-border" data-testid="sidebar-logo">
          <div className="font-serif text-2xl tracking-tight">FulxerPro</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Investment OS</div>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-testid={`nav-${label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
                }`
              }
            >
              <Icon className="w-4 h-4" /> {label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/app/admin" data-testid="nav-admin"
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors mt-4 border-t border-border pt-4 ${isActive ? "bg-accent text-accent-foreground" : "hover:bg-secondary"}`}>
              <Cog className="w-4 h-4" /> Admin
            </NavLink>
          )}
        </nav>
        <div className="border-t border-border p-3">
          <div className="px-3 py-2 text-sm">
            <div className="font-medium truncate" data-testid="sidebar-user-name">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={toggle} data-testid="theme-toggle"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-md border border-border hover:bg-secondary transition">
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />} {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button onClick={handleLogout} data-testid="logout-btn"
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-md border border-border hover:bg-destructive hover:text-destructive-foreground transition">
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-background/80 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl">FulxerPro</Link>
        <div className="flex gap-2">
          <button onClick={toggle} className="p-2 rounded-md border border-border" data-testid="mobile-theme-toggle">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-md border border-border" data-testid="mobile-logout-btn">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="flex-1 min-w-0 md:pl-0 pt-16 md:pt-0">
        <div className="md:hidden flex overflow-x-auto gap-1 px-4 py-2 border-b border-border bg-background sticky top-14 z-30">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-md text-xs ${isActive ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </NavLink>
          ))}
          {isAdmin && <NavLink to="/app/admin" className={({ isActive }) =>
            `flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-md text-xs ${isActive ? "bg-accent text-accent-foreground" : "border border-border"}`}>
            <Cog className="w-3.5 h-3.5" />Admin</NavLink>}
        </div>
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
        <ConciergeWidget />
      </main>
    </div>
  );
}

