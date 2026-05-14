import { Link } from "react-router-dom";
import logo from "../assets/logo/tedmob_logo_dark.svg";

function Nav({ replaySplash, isHome, isContact, theme }) {
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
        className={`navbar-theme flex justify-between items-center px-8 py-11 ${theme.navbar}`}
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
              alt="Tedmob Logo"
              className="nav-logo-img logo-dark h-5 w-auto object-contain"
            />
            <img
              src="./src/assets/logo/tedmob_logo_white.svg"
              alt=""
              aria-hidden="true"
              className="nav-logo-img logo-light h-5 w-auto object-contain"
            />
          </Link>
        </div>
        <ul className="flex gap-12 shrink-0 list-none">
          <li>
            <Link
              to="/work"
              className="no-underline font-semibold text-[0.95rem]"
            >
              WORK
            </Link>
          </li>
          <li>
            <Link
              to="agency"
              className="no-underline font-semibold text-[0.95rem]"
            >
              AGENCY
            </Link>
          </li>
          <li>
            <Link
              to="what-we-do"
              className="no-underline font-semibold text-[0.95rem]"
            >
              WHAT WE DO
            </Link>
          </li>
          <li>
            <Link
              to="solutions"
              className="no-underline font-semibold text-[0.95rem]"
            >
              SOLUTIONS
            </Link>
          </li>
          <li>
            <Link
              to="blog"
              className="no-underline font-semibold text-[0.95rem]"
            >
              BLOG
            </Link>
          </li>
          <li>
            <Link
              to="contact"
              className="no-underline font-semibold text-[0.95rem]"
            >
              CONTACT
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
