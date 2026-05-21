import React, { useEffect, useRef } from "react";

import { NavLink, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  Zap,
  PanelBottom,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/pages", icon: FileText, label: "Pages" },
  { to: "/media", icon: ImageIcon, label: "Media" },
  { to: "/footer", icon: PanelBottom, label: "Footer" },
];

const Sidebar = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {

  const sidebarRef = useRef(null);

  const location = useLocation();

  const { admin } =
    useSelector((state) => state.auth);

  const items = admin?.isMainAdmin
    ? [
        ...navItems,
        {
          to: "/activity",
          icon: Activity,
          label: "Activity",
        },
        {
          to: "/admins",
          icon: Users,
          label: "Admins",
        },
      ]
    : navItems;

  const isActive = (path) => {

    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* CLOSE ON OUTSIDE CLICK */

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        mobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(
          event.target
        )
      ) {

        setMobileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };

  }, [mobileOpen, setMobileOpen]);

  return (
    <>
      {/* MOBILE OVERLAY */}

      {mobileOpen && (

        <div
          onClick={() =>
            setMobileOpen(false)
          }
          className="
            fixed
            inset-0
            bg-black/40
            z-40
            md:hidden
          "
        />

      )}

      {/* SIDEBAR */}

      <aside
        ref={sidebarRef}
        className={`
          fixed
          top-0
          left-0
          h-full
          z-50

          bg-[var(--surface)]

          border-r
          border-[var(--border)]

          flex
          flex-col

          transition-all
          duration-300

          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }

          ${
            collapsed
              ? "md:w-[72px]"
              : "w-60"
          }
        `}
      >

        {/* HEADER */}

        <div
          className={`
            flex
            items-center
            h-16
            px-4
            border-b
            border-[var(--border)]

            ${
              collapsed
                ? "justify-center"
                : "justify-between"
            }
          `}
        >

          <div
            className={`
              flex
              items-center

              ${
                collapsed
                  ? ""
                  : "gap-3"
              }
            `}
          >

            <div
              className="
                w-9
                h-9
                rounded-xl

                bg-gradient-to-br
                from-[var(--accent)]
                to-purple-600

                flex
                items-center
                justify-center

                shadow-md
              "
            >

              <Zap
                size={18}
                className="text-white"
              />

            </div>

            {!collapsed && (

              <div>

                <span
                  className="
                    text-sm
                    font-bold
                    text-[var(--text-primary)]
                  "
                >
                  CMS
                </span>

                <span
                  className="
                    block
                    text-[10px]
                    text-[var(--text-muted)]
                  "
                >
                  Admin
                </span>

              </div>

            )}

          </div>

          {/* MOBILE CLOSE */}

          <button
            onClick={() =>
              setMobileOpen(false)
            }
            className="
              md:hidden
              text-[var(--text-muted)]
            "
          >

            <X size={20} />

          </button>

        </div>

        {/* NAVIGATION */}

        <nav
          className="
            flex-1
            py-4
            px-3
            space-y-1
            overflow-y-auto
          "
        >

          {items.map(
            ({
              to,
              icon: Icon,
              label,
            }) => (

              <NavLink
                key={to}
                to={to}
                end={to === "/"}

                onClick={() =>
                  setMobileOpen(false)
                }

                className={`
                  group
                  flex
                  items-center
                  gap-3

                  px-3
                  py-2.5

                  rounded-xl

                  text-sm
                  font-medium

                  transition-all
                  duration-200

                  ${
                    isActive(to)
                      ? `
                        bg-[var(--accent)]/10
                        text-[var(--accent)]
                      `
                      : `
                        text-[var(--text-secondary)]
                        hover:bg-[var(--hover)]
                      `
                  }

                  ${
  collapsed
    ? "md:justify-center"
    : "justify-start"
}
                `}
              >

                <Icon size={20} />

                <span
  className={`
    whitespace-nowrap

    ${
      collapsed
        ? "hidden md:hidden"
        : "block"
    }
  `}
>
  {label}
</span>

              </NavLink>
            )
          )}

        </nav>

        {/* DESKTOP COLLAPSE */}

        <div
          className="
            hidden
            md:block

            p-3
            border-t
            border-[var(--border)]
          "
        >

          <button
            onClick={() =>
              setCollapsed(
                !collapsed
              )
            }

            className="
              w-full
              flex
              items-center
              justify-center
              gap-2

              px-3
              py-2

              rounded-xl

              hover:bg-[var(--hover)]

              transition-colors
            "
          >

            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                <span>
                  Collapse
                </span>
              </>
            )}

          </button>

        </div>

      </aside>
    </>
  );
};

export default Sidebar;