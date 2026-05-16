import { useSolutions } from '../hooks/useSolutions';
import SolutionsPageHeader from '../components/solutions/SolutionsPageHeader';
import SolutionSection from '../components/solutions/SolutionSection';
import '../styles/solution.css';

function Solutions() {
  const { header, solutions, loading, error } = useSolutions();

  if (loading) {
    return (
      <div className="solutions-page">
        <div className="solutions-loading">
          <div className="solutions-loading-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="solutions-page">
        <div className="solutions-error">
          <p>{error || 'Failed to load solutions. Please try again.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="solutions-page">
      <SolutionsPageHeader header={header} />

      {solutions.map((solution) => (
        <SolutionSection key={solution.id} solution={solution} />
      ))}

      <section className="solutions-footer-spacer" />
    </div>
  );
}

export default Solutions;
