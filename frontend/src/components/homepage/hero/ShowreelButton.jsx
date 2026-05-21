import { useCallback, useLayoutEffect, useMemo, useState } from "react";

// GIF button + video popup
// Receives popupPhase, openPopup, closePopup as props

const ShowreelButton = ({
  popupPhase,
  openPopup,
  closePopup,
  gifRef,
  showreelVideo,
  showreelGif,
  showreelLabelLine2,
  showreelLabelLine1,
}) => {
  const [blastOrigin, setBlastOrigin] = useState({ x: null, y: null });

  const updateOrigin = useCallback(() => {
    const el = gifRef?.current;

    if (!el) return;

    const rect = el.getBoundingClientRect();

    setBlastOrigin({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }, [gifRef]);

  useLayoutEffect(() => {
    updateOrigin();

    window.addEventListener("resize", updateOrigin);
    window.addEventListener("scroll", updateOrigin, { passive: true });

    return () => {
      window.removeEventListener("resize", updateOrigin);
      window.removeEventListener("scroll", updateOrigin);
    };
  }, [updateOrigin]);

  const blastStyle = useMemo(() => {
    if (blastOrigin.x == null || blastOrigin.y == null) return undefined;

    return {
      "--blast-x": `${blastOrigin.x}px`,
      "--blast-y": `${blastOrigin.y}px`,
    };
  }, [blastOrigin.x, blastOrigin.y]);

  return (
    <>
      {/* GIF trigger */}
      <div className="video-hover" onClick={openPopup}>
        <img
          ref={gifRef}
          src={showreelGif}
          alt="Play Showreel"
          onLoad={updateOrigin}
        />
        <small>{showreelLabelLine1} </small>
        <small>{showreelLabelLine2}</small>
      </div>

      {/* White fill animation */}
      <div
        className={`popup-fill
          ${popupPhase === "opening" || popupPhase === "open" ? "expanding" : ""}
        `}
        style={blastStyle}
      />

      {popupPhase === "closing" && (
        <div className="blast-overlay reverse" style={blastStyle} />
      )}

      {/* Popup overlay + video */}
      {popupPhase !== "closed" && (
        <div
          className={`video-popup-overlay ${popupPhase !== "closed" ? "is-active" : ""}`}
          onClick={closePopup}
        >
          <div
            className={`video-popup-content
              ${popupPhase === "open" ? "visible" : ""}
              ${popupPhase === "closing" ? "hiding" : ""}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="video-popup-close"
              onClick={closePopup}
              aria-label="Close video"
            >
              ×
            </button>
            <video controls autoPlay>
              <source src={showreelVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowreelButton;
