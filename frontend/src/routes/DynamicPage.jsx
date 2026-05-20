import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { getPageBySlug } from "../redux/slices/pageSlice";

import { componentMap } from "../utils/componentMap";

function DynamicPage() {
  const dispatch = useDispatch();

  const { slug } = useParams();

  const { page, loading, error } = useSelector((state) => state.page);

  // FETCH PAGE
  useEffect(() => {
    if (slug) {
      dispatch(getPageBySlug(slug));
    }
  }, [dispatch, slug]);

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
        const Component = section.data?.cardType
          ? componentMap[section.data.cardType]
          : componentMap[section.type];

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

export default DynamicPage;
