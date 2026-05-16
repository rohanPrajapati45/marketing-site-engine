// GIF button + video popup
// Receives popupPhase, openPopup, closePopup as props

const ShowreelButton = ({ popupPhase, openPopup, closePopup, gifRef }) => {
  return (
    <>
      {/* GIF trigger */}
      <div className="video-hover" ref={gifRef} onClick={openPopup}>
        <img src="/images/tedmob-gif.gif" alt="Play Showreel" />
        <small>Play Our </small>
        <small>Showreel</small>
      </div>

      {/* White fill animation */}
      <div
        className={`popup-fill
          ${popupPhase === 'opening' || popupPhase === 'open' ? 'expanding' : ''}
          ${popupPhase === 'closing' ? 'collapsing' : ''}
        `}
      />

      {/* Popup overlay + video */}
      {popupPhase !== 'closed' && (
        <div
          className={`video-popup-overlay ${popupPhase !== 'closed' ? 'is-active' : ''}`}
          onClick={closePopup}
        >
          <div
            className={`video-popup-content
              ${popupPhase === 'open' ? 'visible' : ''}
              ${popupPhase === 'closing' ? 'hiding' : ''}
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
              <source src="/videos/showreel.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default ShowreelButton;