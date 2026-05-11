import logoDark from '../assets/logo/tedmob_logo_dark.svg';

const socialLinks = [
  { name: 'Facebook', href: 'https://www.facebook.com/TEDMOB' },
  { name: 'X (Twitter)', href: 'https://twitter.com/ted_mob' },
  { name: 'Instagram', href: 'https://www.instagram.com/tedmob.agency/' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/tedmob' },
  { name: 'YouTube', href: 'https://www.youtube.com/c/Tedmob' },
];

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Agency', href: '/agency' },
  { label: 'What We Do', href: '/what-we-do' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const copyrightText = `Copyrights © ${currentYear} - TEDMOB SAL ALL RIGHTS RESERVED.`;

  return (
    <footer className="bg-white text-black">
      {/* ROW 1 — Desktop copyright above the border */}
      <div className="hidden xl:block text-center text-[13px] text-gray-500 py-4">
        {copyrightText}
      </div>

      {/* ROW 2 — Main bordered row */}
      <div className="border-t border-b border-gray-300">
        <div className="flex items-stretch">
          {/* CELL 1 — Logo (desktop only) */}
          <div className="hidden xl:flex items-center border-r border-gray-300 px-10 py-8">
            <a href="/" aria-label="TEDMOB Home">
              <img src={logoDark} alt="TEDMOB logo" className="h-7 object-contain" />
            </a>
          </div>

          {/* CELL 2 — Social Icons */}
          <div className="flex flex-1">
            {socialLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className={`flex flex-1 xl:flex-none justify-center items-center px-6 xl:px-10 py-7 xl:py-9 text-black transition-opacity duration-200 hover:opacity-40 ${index > 0 ? 'border-l border-gray-300' : ''}`}
              >
                {index === 0 && (
                  <svg width="19" height="34" viewBox="0 0 19.281 36" fill="currentColor">
                    <path d="M19.627,20.25l1-6.515H14.375V9.507c0-1.782.873-3.52,3.673-3.52h2.842V.44A34.658,34.658,0,0,0,15.846,0C10.7,0,7.332,3.12,7.332,8.769v4.965H1.609V20.25H7.332V36h7.043V20.25Z" transform="translate(-1.609)" />
                  </svg>
                )}
                {index === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="32" height="26" fill="currentColor">
                    <path d="M42.5,31.2L66,6h-6L39.8,27.6L24,6H4l24.6,33.6L4,66h6l21.3-22.8L48,66h20L42.5,31.2zM12.9,10h8l38.1,52h-8L12.9,10z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg width="30" height="30" viewBox="0 0 33 33" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <g transform="translate(-1.5 -1.5)">
                      <path d="M10.5,3h15A7.5,7.5,0,0,1,33,10.5v15A7.5,7.5,0,0,1,25.5,33h-15A7.5,7.5,0,0,1,3,25.5v-15A7.5,7.5,0,0,1,10.5,3Z" />
                      <path d="M24,17.055A6,6,0,1,1,18.945,12,6,6,0,0,1,24,17.055Z" />
                      <path d="M26.25,9.75h0" />
                    </g>
                  </svg>
                )}
                {index === 3 && (
                  <svg width="29" height="29" viewBox="0 0 31.5 31.499" fill="currentColor">
                    <path d="M7.051,31.5H.52V10.47H7.051ZM3.782,7.6A3.8,3.8,0,1,1,7.564,3.783,3.814,3.814,0,0,1,3.782,7.6ZM31.493,31.5H24.976V21.263c0-2.44-.049-5.569-3.4-5.569-3.4,0-3.916,2.651-3.916,5.393V31.5H11.142V10.47h6.263v2.869H17.5a6.862,6.862,0,0,1,6.179-3.4c6.609,0,7.824,4.352,7.824,10.005V31.5Z" transform="translate(0 -0.001)" />
                  </svg>
                )}
                {index === 4 && (
                  <svg width="31" height="31" viewBox="-21 -117 682.66672 682" fill="currentColor">
                    <path d="m626.8125 64.035156c-7.375-27.417968-28.992188-49.03125-56.40625-56.414062-50.082031-13.703125-250.414062-13.703125-250.414062-13.703125s-200.324219 0-250.40625 13.183593c-26.886719 7.375-49.03125 29.519532-56.40625 56.933594-13.179688 50.078125-13.179688 153.933594-13.179688 153.933594s0 104.378906 13.179688 153.933594c7.382812 27.414062 28.992187 49.027344 56.410156 56.410156 50.605468 13.707031 250.410156 13.707031 250.410156 13.707031s200.324219 0 250.40625-13.183593c27.417969-7.378907 49.03125-28.992188 56.414062-56.40625 13.175782-50.082032 13.175782-153.933594 13.175782-153.933594s.527344-104.382813-13.183594-154.460938zm-370.601562 249.878906v-191.890624l166.585937 95.945312zm0 0" />
                  </svg>
                )}
              </a>
            ))}
          </div>

          {/* CELL 3 — Nav links (desktop only) */}
          <div className="hidden xl:flex items-center border-l border-gray-300 px-10 py-8">
            <ul className="flex gap-10">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] uppercase font-semibold tracking-widest text-black transition-opacity duration-200 hover:opacity-40"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ROW 3 — Mobile copyright below the border */}
      <div className="xl:hidden text-center text-[13px] text-gray-500 py-4">
        {copyrightText}
      </div>
    </footer>
  );
};

export default Footer;
