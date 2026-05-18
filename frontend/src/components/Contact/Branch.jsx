const Branch = ({
  branchSections = [],
  activeCityIndex = 0,
}) => {
  const safeSections =
    Array.isArray(branchSections)
      ? branchSections
      : [];

  return (

    <section className="branches-section">

      <div className="branches-grid">

        {safeSections.map(
          (section, index) => {

            const branch =
              section.data;

            return (

              <div
                key={section._id}
                className={`branch-card ${
                  activeCityIndex === index
                    ? 'card-active'
                    : ''
                }`}
              >

                <p className="branch-city">
                  {branch.city}
                </p>

                <div className="branch-address">

                  {branch.addressLines?.map(
                    (line, i) => (
                      <p key={i}>
                        {line}
                      </p>
                    )
                  )}

                </div>

                <hr className="branch-divider" />

                <a
                  href={`tel:${branch.phone}`}
                  className="branch-phone"
                >
                  {branch.phone}
                </a>

                <a
                  href={branch.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-directions"
                >
                  <span>
                    Directions
                  </span>
                </a>

              </div>

            );

          }
        )}

      </div>

    </section>

  );
};

export default Branch;