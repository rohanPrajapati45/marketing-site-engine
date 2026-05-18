import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getPageBySlug,
} from "../redux/slices/pageSlice";

import {
  componentMap,
} from "../utils/componentMap";

import "../styles/solution.css";

function Solutions() {

  const dispatch = useDispatch();

  const {
    page,
    loading,
    error,
  } = useSelector(
    (state) => state.page
  );



  // FETCH PAGE
  useEffect(() => {

    dispatch(
      getPageBySlug("solutions")
    );

  }, [dispatch]);



  // LOADING
  if (loading) {

    return (
      <div className="solutions-page">
        <div className="solutions-loading">
          <div className="solutions-loading-spinner" />
        </div>
      </div>
    );
  }



  // ERROR
  if (error) {

    return (
      <div className="solutions-page">
        <div className="solutions-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }



  // NO PAGE
  if (!page) {
    return null;
  }



  return (

    <div className="solutions-page">

      {page.sections?.map(
        (section) => {

          const Component =
            componentMap[
              section.type
            ];



          if (!Component) {

            console.warn(
              `No component found for ${section.type}`
            );

            return null;
          }



          return (
            <Component
              key={section._id}
              section={section}
            />
          );
        }
      )}



      <section className="solutions-footer-spacer" />

    </div>
  );
}

export default Solutions;