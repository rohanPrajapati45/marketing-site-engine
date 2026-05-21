import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import FooterSettings from "../models/FooterSettings.js";

const MONGO_URI = process.env.MONGO_URI;

const seedData = {
  socialLinks: [
    {
      platform: "Facebook",
      url: "https://www.facebook.com/TEDMOB",
      svgViewBox: "0 0 19.281 36",
      svgWidth: "19",
      svgHeight: "34",
      svgPath:
        "M19.627,20.25l1-6.515H14.375V9.507c0-1.782.873-3.52,3.673-3.52h2.842V.44A34.658,34.658,0,0,0,15.846,0C10.7,0,7.332,3.12,7.332,8.769v4.965H1.609V20.25H7.332V36h7.043V20.25Z",
      svgTransform: "translate(-1.609)",
      isMultiPath: false,
      multiPaths: [],
      order: 1,
      isActive: true,
    },
    {
      platform: "X",
      url: "https://twitter.com/ted_mob",
      svgViewBox: "0 0 72 72",
      svgWidth: "32",
      svgHeight: "26",
      svgPath:
        "M42.5,31.2L66,6h-6L39.8,27.6L24,6H4l24.6,33.6L4,66h6l21.3-22.8L48,66h20L42.5,31.2zM12.9,10h8l38.1,52h-8L12.9,10z",
      svgTransform: "",
      isMultiPath: false,
      multiPaths: [],
      order: 2,
      isActive: true,
    },
    {
      platform: "Instagram",
      url: "https://www.instagram.com/tedmob.agency/",
      svgViewBox: "0 0 33 33",
      svgWidth: "30",
      svgHeight: "30",
      svgPath: "",
      svgTransform: "",
      isMultiPath: true,
      multiPaths: [
        {
          d: "M10.5,3h15A7.5,7.5,0,0,1,33,10.5v15A7.5,7.5,0,0,1,25.5,33h-15A7.5,7.5,0,0,1,3,25.5v-15A7.5,7.5,0,0,1,10.5,3Z",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "3",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transform: "translate(-1.5 -1.5)",
        },
        {
          d: "M24,17.055A6,6,0,1,1,18.945,12,6,6,0,0,1,24,17.055Z",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "3",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transform: "translate(-1.5 -1.5)",
        },
        {
          d: "M26.25,9.75h0",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "3",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          transform: "translate(-1.5 -1.5)",
        },
      ],
      order: 3,
      isActive: true,
    },
    {
      platform: "LinkedIn",
      url: "https://www.linkedin.com/company/tedmob",
      svgViewBox: "0 0 31.5 31.499",
      svgWidth: "29",
      svgHeight: "29",
      svgPath:
        "M7.051,31.5H.52V10.47H7.051ZM3.782,7.6A3.8,3.8,0,1,1,7.564,3.783,3.814,3.814,0,0,1,3.782,7.6ZM31.493,31.5H24.976V21.263c0-2.44-.049-5.569-3.4-5.569-3.4,0-3.916,2.651-3.916,5.393V31.5H11.142V10.47h6.263v2.869H17.5a6.862,6.862,0,0,1,6.179-3.4c6.609,0,7.824,4.352,7.824,10.005V31.5Z",
      svgTransform: "translate(0 -0.001)",
      isMultiPath: false,
      multiPaths: [],
      order: 4,
      isActive: true,
    },
    {
      platform: "YouTube",
      url: "https://www.youtube.com/c/Tedmob",
      svgViewBox: "-21 -117 682.66672 682",
      svgWidth: "31",
      svgHeight: "31",
      svgPath:
        "m626.8125 64.035156c-7.375-27.417968-28.992188-49.03125-56.40625-56.414062-50.082031-13.703125-250.414062-13.703125-250.414062-13.703125s-200.324219 0-250.40625 13.183593c-26.886719 7.375-49.03125 29.519532-56.40625 56.933594-13.179688 50.078125-13.179688 153.933594-13.179688 153.933594s0 104.378906 13.179688 153.933594c7.382812 27.414062 28.992187 49.027344 56.410156 56.410156 50.605468 13.707031 250.410156 13.707031 250.410156 13.707031s200.324219 0 250.40625-13.183593c27.417969-7.378907 49.03125-28.992188 56.414062-56.40625 13.175782-50.082032 13.175782-153.933594 13.175782-153.933594s.527344-104.382813-13.183594-154.460938zm-370.601562 249.878906v-191.890624l166.585937 95.945312zm0 0",
      svgTransform: "",
      isMultiPath: false,
      multiPaths: [],
      order: 5,
      isActive: true,
    },
  ],
  copyrightText: "Copyrights © 2026 - TEDMOB SAL ALL RIGHTS RESERVED.",
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const doc = await FooterSettings.getSingleton(seedData);
    console.log("✅ Footer settings seeded successfully!", doc._id);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
