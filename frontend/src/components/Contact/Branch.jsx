const Branch = ({ branch, isActive }) => {
  return (
    <div className={`branch-card${isActive ? ' card-active' : ''}`}>
      <p className="branch-city">{branch.city}</p>
      <div className="branch-address">
        {branch.addressLines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
      <hr className="branch-divider" />
      <a href={`tel:${branch.phone}`} className="branch-phone">
        {branch.phone}
      </a>
      <a
        href={branch.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-directions"
      >
        <span>Directions</span>
      </a>
    </div>
  );
};

export default Branch;
