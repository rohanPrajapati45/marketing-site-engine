import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getPageBySlug } from "../redux/slices/pageSlice";

import { componentMap } from "../utils/componentMap"; 

function Work() {

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
      getPageBySlug("work")
    );

  }, [dispatch]);



  // LOADING
  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }



  // ERROR
  if (error) {

    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }



  // NO PAGE
  if (!page) {
    return null;
  }



  return (

    <div>

      {page.sections?.map(
        (section) => {

          // FIND COMPONENT
          const Component =
            componentMap[
              section.type
            ];



          // COMPONENT NOT FOUND
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

    </div>
  );
}

export default Work;