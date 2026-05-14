import React from "react";
import { Link } from "react-router-dom";
import Btn_slide from "../Btn_slide";

export default function SolutionsCTA() {
  return (
    <section className="px-6 py-34 h-[508px]]">
      <div className="mx-auto max-w-5xl">
        {/* TEXT */}
        <div className="text-center">
          <p className="text-[3.5rem] font-[700] md:text-[2.5rem]">
            Looking for a Specific Solution?
          </p>

          <div className="mx-auto mt-4 max-w-2xl">
            <p className="text-[15px] leading-[1.8] text-black/70">
              Check out our "Awesome Ready Solutions" that can
              Digitally Transform your Business!
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-10 ml-100">
          <Link to="/solutions">
            <Btn_slide inside="Our Solutions" />
          </Link>
        </div>
      </div>
    </section>
  );
}