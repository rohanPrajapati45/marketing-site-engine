import { Link } from "react-router-dom";
import logo from "../assets/logo/tedmob_logo_dark.svg";
import whiteLogo from "../assets/logo/tedmob_logo_white.svg";
import { useSelector } from "react-redux";

function Nav({ replaySplash, isHome, isContact, theme }) {
  const { navItems } = useSelector((state) => state.navigation);
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
        className={`flex justify-between items-center px-8 py-11 ${
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
          {navItems.map((item) => {
            const route = item.slug === "home" ? "/" : `/${item.slug}`;

            return (
              <li key={item._id}>
                <Link
                  to={route}
                  className="no-underline font-semibold text-[0.95rem]"
                >
                  {item.navTitle}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Nav;
