import { useEffect, useRef, useState } from "react";
import ColorThief from "colorthief";

const DEFAULT_THRESHOLD = 145;

const getBrightnessFromRgb = (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000;

const getThemeFromBrightness = (brightness, threshold = DEFAULT_THRESHOLD) =>
  brightness >= threshold ? "light" : "dark";

export const getImageTheme = (src, threshold = DEFAULT_THRESHOLD) =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("dark");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const [r, g, b] = colorThief.getColor(img);
        const brightness = getBrightnessFromRgb(r, g, b);
        resolve(getThemeFromBrightness(brightness, threshold));
      } catch (error) {
        resolve("dark");
      }
    };

    img.onerror = () => resolve("dark");
    img.src = src;
  });

export const useVideoTheme = (
  videoRef,
  {
    threshold = DEFAULT_THRESHOLD,
    sampleIntervalMs = 600,
    sampleSize = 32,
    intersectionThreshold = 0.6,
  } = {}
) => {
  const [theme, setTheme] = useState("dark");
  const lastSampleRef = useRef(0);
  const frameIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = sampleSize;
    canvas.height = sampleSize;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const updateTheme = (nextTheme) => {
      setTheme((prev) => (prev === nextTheme ? prev : nextTheme));
    };

    const analyzeFrame = () => {
      if (!video || video.readyState < 2) return;

      try {
        ctx.drawImage(video, 0, 0, sampleSize, sampleSize);
        const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;
        let total = 0;

        for (let i = 0; i < data.length; i += 4) {
          total += getBrightnessFromRgb(data[i], data[i + 1], data[i + 2]);
        }

        const brightness = total / (sampleSize * sampleSize);
        updateTheme(getThemeFromBrightness(brightness, threshold));
      } catch (error) {
        // Ignore frame errors (e.g., not ready yet)
      }
    };

    const stopSampling = () => {
      isRunningRef.current = false;

      if (intervalIdRef.current) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }

      if (video.cancelVideoFrameCallback && frameIdRef.current) {
        video.cancelVideoFrameCallback(frameIdRef.current);
        frameIdRef.current = null;
      }
    };

    const startSampling = () => {
      if (isRunningRef.current) return;
      isRunningRef.current = true;
      analyzeFrame();

      if (video.requestVideoFrameCallback) {
        const onFrame = (now) => {
          if (!isRunningRef.current) return;

          if (now - lastSampleRef.current >= sampleIntervalMs) {
            lastSampleRef.current = now;
            analyzeFrame();
          }

          frameIdRef.current = video.requestVideoFrameCallback(onFrame);
        };

        frameIdRef.current = video.requestVideoFrameCallback(onFrame);
      } else {
        intervalIdRef.current = window.setInterval(analyzeFrame, sampleIntervalMs);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startSampling();
        } else {
          stopSampling();
        }
      },
      { threshold: intersectionThreshold }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      stopSampling();
    };
  }, [intersectionThreshold, sampleIntervalMs, sampleSize, threshold, videoRef]);

  return theme;
};
