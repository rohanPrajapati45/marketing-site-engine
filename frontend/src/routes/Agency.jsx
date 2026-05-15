import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getPageBySlug } from "../redux/slices/pageSlice";

import { componentMap } from "../utils/componentMap";

function Agency() {
  const dispatch = useDispatch();

  const { page, loading, error } = useSelector((state) => state.page);

  // FETCH PAGE
  useEffect(() => {
    dispatch(getPageBySlug("agency"));
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
      {page.sections?.map((section) => {
        // PICK COMPONENT
        const Component = section.data?.cardType
          ? componentMap[section.data.cardType]
          : componentMap[section.type];

        // COMPONENT NOT FOUND
        if (!Component) {
          console.warn(
            `No component found for ${section.data?.cardType || section.type}`,
          );

          return null;
        }

        return <Component key={section._id} section={section} />;
      })}
    </div>
  );
}

export default Agency;
