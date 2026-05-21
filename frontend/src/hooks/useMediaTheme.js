import { useEffect, useRef, useState } from "react";

const DEFAULT_THRESHOLD = 145;

const getBrightnessFromRgb = (r, g, b) => (r * 299 + g * 587 + b * 114) / 1000;

const getThemeFromBrightness = (brightness, threshold = DEFAULT_THRESHOLD) =>
  brightness >= threshold ? "light" : "dark";

const getNavbarHeightRatio = (navSelector) => {
  if (!navSelector || typeof window === "undefined") return null;
  const nav = document.querySelector(navSelector);
  if (!nav) return null;

  const rect = nav.getBoundingClientRect();
  if (!rect.height || !window.innerHeight) return null;
  return rect.height / window.innerHeight;
};

const getSampleRect = ({
  mediaWidth,
  mediaHeight,
  topRatio,
  topOffsetRatio,
  navSelector,
}) => {
  const navRatio = getNavbarHeightRatio(navSelector);
  const heightRatio = Math.max(topRatio, navRatio ?? 0);

  const sampleHeight = Math.max(1, Math.round(mediaHeight * heightRatio));
  const offsetY = Math.max(0, Math.round(mediaHeight * topOffsetRatio));

  return {
    sx: 0,
    sy: Math.min(offsetY, mediaHeight - sampleHeight),
    sWidth: mediaWidth,
    sHeight: sampleHeight,
  };
};

const getAverageBrightnessFromCanvas = (ctx, width, height, pixelStride) => {
  const data = ctx.getImageData(0, 0, width, height).data;
  let total = 0;
  let count = 0;

  for (let i = 0; i < data.length; i += 4 * pixelStride) {
    total += getBrightnessFromRgb(data[i], data[i + 1], data[i + 2]);
    count += 1;
  }

  return count ? total / count : 0;
};

export const getImageTheme = (
  src,
  {
    threshold = DEFAULT_THRESHOLD,
    sampleWidth = 48,
    topRatio = 0.12,
    topOffsetRatio = 0,
    pixelStride = 3,
    navSelector = ".navbar-theme",
  } = {}
) =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("dark");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const sampleHeight = Math.max(6, Math.round(sampleWidth * 0.35));
      canvas.width = sampleWidth;
      canvas.height = sampleHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        resolve("dark");
        return;
      }

      const rect = getSampleRect({
        mediaWidth: img.naturalWidth || img.width,
        mediaHeight: img.naturalHeight || img.height,
        topRatio,
        topOffsetRatio,
        navSelector,
      });

      try {
        ctx.drawImage(
          img,
          rect.sx,
          rect.sy,
          rect.sWidth,
          rect.sHeight,
          0,
          0,
          sampleWidth,
          sampleHeight
        );

        const brightness = getAverageBrightnessFromCanvas(
          ctx,
          sampleWidth,
          sampleHeight,
          pixelStride
        );
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
    enabled = true,
    threshold = DEFAULT_THRESHOLD,
    sampleIntervalMs = 600,
    sampleWidth = 48,
    intersectionThreshold = 0.6,
    topRatio = 0.12,
    topOffsetRatio = 0,
    pixelStride = 3,
    navSelector = ".navbar-theme",
    debounceMs = 180,
  } = {}
) => {
  const [theme, setTheme] = useState("dark");
  const lastSampleRef = useRef(0);
  const frameIdRef = useRef(null);
  const intervalIdRef = useRef(null);
  const isRunningRef = useRef(false);
  const debounceRef = useRef(null);
  const pendingThemeRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video || typeof window === "undefined") return;

    const canvas = document.createElement("canvas");
    const sampleHeight = Math.max(6, Math.round(sampleWidth * 0.35));
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const updateTheme = (nextTheme) => {
      if (pendingThemeRef.current === nextTheme) return;
      pendingThemeRef.current = nextTheme;

      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }

      debounceRef.current = window.setTimeout(() => {
        setTheme((prev) => (prev === nextTheme ? prev : nextTheme));
      }, debounceMs);
    };

    const analyzeFrame = () => {
      if (!video || video.readyState < 2) return;

      try {
        const rect = getSampleRect({
          mediaWidth: video.videoWidth || sampleWidth,
          mediaHeight: video.videoHeight || sampleHeight,
          topRatio,
          topOffsetRatio,
          navSelector,
        });

        ctx.drawImage(
          video,
          rect.sx,
          rect.sy,
          rect.sWidth,
          rect.sHeight,
          0,
          0,
          sampleWidth,
          sampleHeight
        );

        const brightness = getAverageBrightnessFromCanvas(
          ctx,
          sampleWidth,
          sampleHeight,
          pixelStride
        );
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
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [
    enabled,
    debounceMs,
    intersectionThreshold,
    navSelector,
    pixelStride,
    sampleIntervalMs,
    sampleWidth,
    threshold,
    topOffsetRatio,
    topRatio,
    videoRef,
  ]);

  return theme;
};
