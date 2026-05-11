import React from "react";
import { Link } from "react-router-dom";

function Nav({ replaySplash }) {
  return (
    <div>
      <div className="flex justify-between items-center px-8 py-6 bg-transparent text-black mt-7">
        <div>
          <Link to="/">
            <img
              onClick={(e) => {
                replaySplash();
              }}
              src="./src/assets/logo/tedmob_logo_dark.svg"
              alt="Tedmob Logo"
              className="h-5 w-auto object-contain"
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
