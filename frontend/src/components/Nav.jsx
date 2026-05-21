import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo/tedmob_logo_dark.svg";
import whiteLogo from "../assets/logo/tedmob_logo_white.svg";
import { useSelector } from "react-redux";

function Nav({ replaySplash, isHome, isContact, theme }) {
  const { navItems } = useSelector((state) => state.navigation);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <div
      className={
        isHome
          ? "fixed inset-x-0 top-0 z-30"
          : isContact
            ? "absolute inset-x-0 top-0 z-30"
            : "relative"
      }
    >
      <div
        className={`relative flex justify-between items-center px-6 py-7 md:px-8 md:py-11 ${
          theme?.navbar || "navbar-theme"
        }`}
      >
        <div>
          <Link
            to="/"
            className="nav-logo"
            onClick={() => {
              replaySplash();
            }}
          >
            <img
              onClick={() => {
                replaySplash();
              }}
              src={logo}
              alt="Company's Logo"
              className="nav-logo-img logo-dark h-5 w-auto object-contain"
            />
            <img
              src="./src/assets/logo/tedmob_logo_white.svg"
              alt="Company's Logo"
              aria-hidden="true"
              className="nav-logo-img logo-light h-5 w-auto object-contain"
            />
          </Link>
        </div>
        <button
          type="button"
          className={`nav-menu-icon nav-toggle md:hidden ${
            isMenuOpen ? "is-open" : ""
          }`}
          aria-label="Toggle navigation"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          onClick={handleToggleMenu}
        >
          <span className="nav-toggle-line" />
          <span className="nav-toggle-line" />
        </button>
        <ul className="hidden md:flex gap-12 shrink-0 list-none" id="primary-nav">
          {navItems.map((item) => {
            const route = item.slug === "home" ? "/" : `/${item.slug}`;

            return (
              <li key={item._id}>
                <Link
                  to={route}
                  className="no-underline font-semibold text-[0.95rem]"
                  onClick={handleNavClick}
                >
                  {item.navTitle}
                </Link>
              </li>
            );
          })}
        </ul>
        <div
          className={`nav-mobile-panel md:hidden ${
            isMenuOpen ? "is-open" : ""
          }`}
          role="dialog"
        >
          <ul className="flex flex-col gap-6 px-6 pb-8 pt-6 list-none">
            {navItems.map((item) => {
              const route = item.slug === "home" ? "/" : `/${item.slug}`;

              return (
                <li key={item._id}>
                  <Link
                    to={route}
                    className="nav-mobile-link"
                    onClick={handleNavClick}
                  >
                    {item.navTitle}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Nav;
