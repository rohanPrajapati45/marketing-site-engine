import React from "react";

function Nav() {
  return (
    <div>
      <div
        className="flex justify-between items-center px-8 py-6 bg-white text-black"
        mt-8
      >
        <div>
          <a href="#">
            <img
              src="/logo/logo-black.svg"
              alt="Tedmob Logo"
              className="h-8 w-auto object-contain"
            />
          </a>
        </div>
        <ul className="flex gap-10 shrink-0 list-none">
          <li>
            <a href="" className="no-underline font-medium text-sm">
              WORK
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-medium text-sm">
              AGENCY
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-medium text-sm">
              WHAT WE DO
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-medium text-sm">
              SOLUTIONS
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-medium text-sm">
              BLOG
            </a>
          </li>
          <li>
            <a href="" className="no-underline font-medium text-sm">
              CONTACT
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
