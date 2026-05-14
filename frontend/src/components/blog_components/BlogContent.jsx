import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

function BlogContent() {
  return (
    <section className="w-full bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[90px_minmax(0,1fr)] gap-10">
          {/* Floating Social Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-gray-600 text-sm mb-3">Share it on</p>

              <div className="w-[72px] border border-gray-300 bg-white">
                <a
                  href="#"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaFacebookF />
                </a>

                <a
                  href="#"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaTwitter />
                </a>

                <a
                  href="#"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <div className="max-w-5xl">
            <p className="text-[1.15rem] leading-[1.9] text-[#4a4a4a]">
              Beirut-based technology agency tops Clutch, GoodFirms, and
              TechBehemoths rankings, cementing its position as the leading
              digital product company in Lebanon and the MENA region.
            </p>

            <p className="mt-5 text-[1.15rem] leading-[1.9] text-[#4a4a4a]">
              Beirut, Lebanon - March 2026 - TEDMOB, Lebanon's premier web and
              mobile application development agency, has been ranked #1 web and
              app development company in Lebanon across three of the world's
              most trusted B2B technology review platforms.
            </p>

            <h2 className="mt-14 text-3xl font-semibold text-[#222]">
              A Decade of Digital Excellence
            </h2>

            <p className="mt-5 text-[1.15rem] leading-[1.9] text-[#4a4a4a]">
              Founded and headquartered in Beirut, TEDMOB has spent over a
              decade building scalable and high-performance digital solutions
              for enterprises across Lebanon, Saudi Arabia, Kuwait, UAE, and
              beyond.
            </p>

            <h2 className="mt-14 text-3xl font-semibold text-[#222]">
              What Sets TEDMOB Apart
            </h2>

            <p className="mt-5 text-[1.15rem] leading-[1.9] text-[#4a4a4a]">
              Unlike traditional web agencies, TEDMOB operates as a long-term
              technology partner — supporting clients from concept through
              deployment, maintenance, and continuous growth.
            </p>

            {/* extra content for scrolling */}
            <div className="space-y-6 mt-10">
              {[...Array(10)].map((_, i) => (
                <p
                  key={i}
                  className="text-[1.15rem] leading-[1.9] text-[#4a4a4a]"
                >
                  TEDMOB continues delivering enterprise-grade digital products,
                  AI-powered platforms, mobile applications, fintech systems,
                  and scalable web solutions for regional and international
                  clients.
                </p>
              ))}
            </div>
            <div className="h-[10vh]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogContent;
