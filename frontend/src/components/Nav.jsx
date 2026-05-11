import React from "react";

function Nav() {
  return (
    <div>
      <div className="flex justify-between items-center px-8 py-6 bg-transparent text-black mt-7">
        <div>
          <a href="#">
            <img
              src="./src/assets/logo/tedmob_logo_dark.svg"
              alt="Tedmob Logo"
              className="h-5 w-auto object-contain"
            />
          </a>
        </div>
        <ul className="flex gap-12 shrink-0 list-none">
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              WORK
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              AGENCY
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              WHAT WE DO
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              SOLUTIONS
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              BLOG
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-semibold text-[0.95rem]">
              CONTACT
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
