const SolutionTags = ({ tags }) => {
  if (!tags || !tags.length) return null;

  return (
    <div className="solution-tags">
      {tags.map((tag, i) => (
        <span key={i} className="solution-tag">
          {tag}
        </span>
      ))}
    </div>
  );
};

export default SolutionTags;
