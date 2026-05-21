import React from "react";

const WorkSubmenu = ({
  activeTab,
  subCategories,
  previousMenu,
  isAnimating,
  direction,
  hasSubmenu,
  selectedFilter,
  onSelectFilter,
}) => {

  return (
    <div
      className={`relative overflow-hidden ml-0 sm:ml-[12px] transition-all duration-500
        ${
          hasSubmenu
            ? "mt-4 sm:mt-[18px] h-[240px] sm:h-[170px] opacity-100"
            : "mt-6 sm:mt-[50px] h-0 opacity-0 pointer-events-none"
        }
      `}
    >

      {/* OLD MENU */}
      {previousMenu &&
        isAnimating && (
        <div
          className={`absolute inset-0 pointer-events-none
            ${
              direction === "up"
                ? "animate-old-up"
                : "animate-old-down"
            }
          `}
        >

          <div className="max-h-[200px] sm:max-h-[170px] overflow-y-auto pr-2">
            <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 sm:gap-y-[6px] sm:gap-x-[6px]">
            {subCategories[
              previousMenu
            ]?.map((item, index) => (
              <button
                key={index}
                className="w-fit text-left text-[0.9rem] sm:text-[0.9rem] font-[400] text-[#1d1d1d]"
              >
                {item}
              </button>
            ))}
            </div>
          </div>
        </div>
      )}
      {/* NEW MENU */}
      <div
        className={`absolute inset-0
          ${
            direction === "up"
              ? "animate-new-up"
              : "animate-new-down"
          }
        `}
      >

        <div className="max-h-[200px] sm:max-h-[170px] overflow-y-auto pr-2">
          <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-4 sm:gap-y-[6px] sm:gap-x-[6px]">

          {subCategories[
            activeTab
          ]?.map((item, index) => {
            const isActive =
              selectedFilter === item;

            return (
              <button
                key={index}
                onClick={() => onSelectFilter(item)}
                aria-pressed={isActive}
                className={`
                  group
                  relative

                  w-fit

                  overflow-hidden

                  px-[16px]
                  py-[4px]
                  my-[2px]

                  cursor-pointer

                  z-[1]

                  transition-all
                  duration-[400ms]
                  ease-[cubic-bezier(0.9,1,0.36,1)]

                  sm:hover:translate-x-[12px]

                  ${
                    isActive
                      ? "sm:translate-x-[10px]"
                      : ""
                  }
                `}
              >

              {/* BG */}
              <span
                className={`
                  absolute
                  inset-0

                  bg-black

                  z-[-1]

                  origin-left

                  transition-transform
                  duration-[400ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0"
                  }

                  group-hover:scale-x-100
                `}
              />

              {/* TEXT */}
              <span
                className={`
                  relative
                  z-[2]

                  text-[0.92rem]
                  font-[400]

                  tracking-[-0.01em]

                  transition-colors
                  duration-[400ms]
                  ease-[cubic-bezier(0.22,1,0.36,1)]

                  ${
                    isActive
                      ? "text-white"
                      : "text-[#1d1d1d]"
                  }

                  group-hover:text-white
                `}
              >
                {item}
              </span>

              </button>
            );
          })}

          </div>
        </div>

      </div>

    </div>
  );
};

export default WorkSubmenu;