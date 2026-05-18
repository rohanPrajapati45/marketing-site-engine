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
  return (
    <>
      {/* GIF trigger */}
      <div className="video-hover" ref={gifRef} onClick={openPopup}>
        <img src={showreelGif} alt="Play Showreel" />
        <small>{showreelLabelLine1} </small>
        <small>{showreelLabelLine2}</small>
      </div>

      {/* White fill animation */}
      <div
        className={`popup-fill
          ${popupPhase === "opening" || popupPhase === "open" ? "expanding" : ""}
          ${popupPhase === "closing" ? "collapsing" : ""}
        `}
      />

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
            <video controls autoPlay key={popupPhase}>
              <source src={showreelVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowreelButton;
