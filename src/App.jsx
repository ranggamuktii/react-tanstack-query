import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Routes from "./routes/index";

export default function App() {
  const [open, setOpen] = useState(false);

  const navLink = ({ isActive }) =>
    [
      "block rounded-lg px-3 py-2 text-sm font-medium transition",
      isActive
        ? "text-white bg-white/10"
        : "text-slate-300 hover:text-white hover:bg-white/10",
    ].join(" ");

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Kiri: Brand + Menu (desktop) */}
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-white font-semibold tracking-wide hover:opacity-90"
              >
                HOME
              </Link>

              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/products" className={navLink}>
                  PRODUCTS
                </NavLink>
              </div>
            </div>

            {/* Tombol menu mobile */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Toggle navigation</span>
              {/* Icon hamburger */}
              <svg
                className={`h-6 w-6 ${open ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
              </svg>
              {/* Icon close */}
              <svg
                className={`h-6 w-6 ${open ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* MENU MOBILE */}
        <div id="mobile-menu" className={`${open ? "block" : "hidden"} md:hidden`}>
          <div className="space-y-1 px-4 pb-4 pt-2">
            <NavLink to="/products" className={navLink} onClick={() => setOpen(false)}>
              PRODUCTS
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes />
    </>
  );
}
