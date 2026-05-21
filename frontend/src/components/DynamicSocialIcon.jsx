/**
 * DynamicSocialIcon — renders a social icon from database-stored data.
 * Supports 2 icon types:
 *   - "svg-path" → renders SVG from d= path attribute (default, backward compat)
 *   - "image"    → renders an <img> tag from a URL (uploaded PNG/JPG/WebP/SVG file)
 */
const DynamicSocialIcon = ({
  iconType,
  svgPath,
  svgViewBox,
  svgWidth,
  svgHeight,
  svgTransform,
  imageUrl,
  platform,
  isMultiPath,
  multiPaths,
}) => {
  // Determine the effective icon type (default to svg-path for backward compat)
  const type = iconType || "svg-path";

  // ── Image / uploaded file ──
  if (type === "image" && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={platform || "social icon"}
        className="relative object-contain"
        style={{ width: "28px", height: "28px" }}
      />
    );
  }

  // ── SVG path (original method) ──
  // Use the stored viewBox, or fall back to a safe default
  const viewBox = svgViewBox || "0 0 24 24";
  const width = svgWidth || "28";
  const height = svgHeight || "28";

  if (isMultiPath && multiPaths && multiPaths.length > 0) {
    // Multi-path SVG (e.g. Instagram with stroke-based paths)
    return (
      <svg
        className="relative"
        width={width}
        height={height}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-label={platform}
      >
        <g transform={multiPaths[0]?.transform || ""}>
          {multiPaths.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill={p.fill || "none"}
              stroke={p.stroke || "currentColor"}
              strokeWidth={p.strokeWidth || undefined}
              strokeLinecap={p.strokeLinecap || undefined}
              strokeLinejoin={p.strokeLinejoin || undefined}
            />
          ))}
        </g>
      </svg>
    );
  }

  // Single-path SVG (Facebook, X, LinkedIn, YouTube)
  if (svgPath) {
    return (
      <svg
        className="relative"
        width={width}
        height={height}
        viewBox={viewBox}
        fill="currentColor"
        aria-label={platform}
      >
        <path d={svgPath} transform={svgTransform || undefined} />
      </svg>
    );
  }

  // Fallback — empty placeholder
  return null;
};

export default DynamicSocialIcon;
