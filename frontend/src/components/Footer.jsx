import logoDark from "../assets/logo/tedmob_logo_dark.svg";
import useFooterData from "../hooks/useFooterData";
import DynamicSocialIcon from "./DynamicSocialIcon";
import { Link } from "react-router-dom";

const Footer = () => {
  const { socialLinks, navLinks, copyrightText, showLogo, isLoading } = useFooterData();

  // Fallback copyright while loading
  const displayCopyright =
    copyrightText || `Copyrights © ${new Date().getFullYear()} - TEDMOB SAL ALL RIGHTS RESERVED.`;

  return (
    <footer className="bg-[#fafafa] text-black">
      {/* ROW 1 — Desktop/Tablet copyright above the border (hidden on mobile) */}
      <div className="hidden md:block text-center text-[13px] text-gray-500 py-4">
        {displayCopyright}
      </div>

      {/* ROW 2 — Main bordered row */}
      <div className="border-t border-b border-black">
        <div className="flex items-stretch">
          {/* CELL 1 — Logo (hidden on mobile <768px, smaller on tablet, full on desktop) */}
          {showLogo && (
            <div className="hidden md:flex shrink-0 items-center border-r border-black px-6 py-8 lg:px-11 lg:py-12">
              <a href="/" aria-label="TEDMOB Home">
                <img
                  src={logoDark}
                  alt="TEDMOB logo"
                  className="h-4 lg:h-5 object-contain"
                />
              </a>
            </div>
          )}

          {/* CELL 2 — Social Icons (always visible, centered on mobile, flex-1 on tablet+) */}
          <div className="flex flex-1 items-stretch justify-center flex-wrap md:flex-nowrap">
            {!isLoading &&
              socialLinks.map((link, index) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className={`relative overflow-hidden group flex flex-1 justify-center items-center px-6 py-7 text-black ${index > 0 ? "border-l border-gray-600" : ""}`}
                >
                  <span
                    className="absolute bottom-0 left-0 w-full h-0 group-hover:h-[15%] bg-black transition-[height] duration-300 ease-out pointer-events-none"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 text-black">
                    <DynamicSocialIcon
                      iconType={link.iconType}
                      svgPath={link.svgPath}
                      svgViewBox={link.svgViewBox}
                      svgWidth={link.svgWidth}
                      svgHeight={link.svgHeight}
                      svgTransform={link.svgTransform}
                      imageUrl={link.imageUrl}
                      platform={link.platform}
                      isMultiPath={link.isMultiPath}
                      multiPaths={link.multiPaths}
                    />
                  </span>
                </a>
              ))}
          </div>

          {/* CELL 3 — Nav links (hidden on mobile <768px, visible on tablet/desktop) */}
          <div className="hidden md:flex shrink-0 items-center border-l border-gray-600 px-5 py-6 lg:px-10 lg:py-8">
            <ul className="flex gap-6 lg:gap-12 flex-wrap">
              {navLinks.map((item) => {
                const route = item.slug === "home" ? "/" : `/${item.slug}`;
                return (
                  <li key={item._id}>
                    <Link
                      to={route}
                      className="text-[0.85rem] lg:text-[1rem] uppercase font-semibold tracking-tighters text-black transition-opacity duration-200 "
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

      {/* ROW 3 — Mobile copyright below the border (visible only on mobile <768px) */}
      <div className="md:hidden text-center text-[13px] text-gray-500 py-4">
        {displayCopyright}
      </div>
    </footer>
  );
};

export default Footer;
