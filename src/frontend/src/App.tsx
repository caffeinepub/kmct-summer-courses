import { Toaster } from "@/components/ui/sonner";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import { AdminPage } from "./pages/AdminPage";
import { HomePage } from "./pages/HomePage";

function RootLayout() {
  const { isDark, toggleTheme } = useTheme();

  const bg = isDark ? "oklch(0.1 0.004 285)" : "oklch(0.98 0.003 85)";
  const navBg = isDark
    ? "oklch(0.1 0.004 285 / 0.92)"
    : "oklch(0.97 0.005 85 / 0.95)";
  const navBorder = isDark ? "oklch(0.2 0.008 285)" : "oklch(0.82 0.01 85)";
  const logoColor = isDark ? "oklch(0.93 0.005 285)" : "oklch(0.15 0.005 285)";
  const mutedColor = isDark ? "oklch(0.42 0.008 285)" : "oklch(0.45 0.01 285)";
  const linkColor = isDark ? "oklch(0.52 0.01 285)" : "oklch(0.38 0.01 285)";
  const footerBorder = isDark ? "oklch(0.16 0.007 285)" : "oklch(0.82 0.01 85)";
  const footerText = isDark ? "oklch(0.32 0.006 285)" : "oklch(0.48 0.01 285)";
  const toggleColor = isDark ? "oklch(0.62 0.08 85)" : "oklch(0.45 0.1 75)";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: bg, transition: "background 0.3s ease" }}
    >
      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: navBg,
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderBottom: `1px solid ${navBorder}`,
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        <Link to="/" className="flex items-center gap-3" data-ocid="nav.link">
          <span
            className="font-display font-bold text-sm tracking-widest uppercase"
            style={{ color: logoColor }}
          >
            KMCT
          </span>
          <span
            className="text-xs tracking-widest uppercase hidden sm:block"
            style={{ color: mutedColor }}
          >
            School of Design
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-xs tracking-widest uppercase transition-colors"
            style={{ color: linkColor }}
            data-ocid="nav.link"
          >
            Courses
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
            className="p-1.5 rounded transition-colors"
            style={{ color: toggleColor }}
            data-ocid="nav.toggle"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/admin"
            className="text-xs tracking-widest uppercase transition-colors"
            style={{ color: linkColor }}
            data-ocid="admin.link"
          >
            Admin
          </Link>
        </nav>
      </header>

      <div className="pt-[65px] flex-1 flex flex-col">
        <Outlet />
      </div>

      {/* Footer */}
      <footer
        className="py-8 px-6"
        style={{
          borderTop: `1px solid ${footerBorder}`,
          transition: "border-color 0.3s ease",
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: footerText }}
          >
            KMCT School of Design · Summer 2026
          </span>
          <a
            href="https://anthropocene.in"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-credit-link text-xs tracking-wider"
          >
            Made by Abhishek Tiwari · anthropocene.in
          </a>
        </div>
      </footer>
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootLayout });

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([homeRoute, adminRoute]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
