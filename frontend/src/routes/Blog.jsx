import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getBlogs, setCurrentPage } from "../redux/slices/blogSlice";

import BlogCards from "../components/blog_components/BlogCards";

import Pagination from "../components/blog_components/Pagination";

import AgencyTagLine from "../components/agency_components/AgencyTagLine";

function Blog() {
  const dispatch = useDispatch();

  const { blogs, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.blog,
  );

  // FETCH BLOGS
  useEffect(() => {
    dispatch(getBlogs(currentPage));
  }, [dispatch, currentPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <AgencyTagLine
        section={{
          data: {
            title: "Insights & Articles",

            subtitle: "Latest updates and industry insights",
          },
        }}
      />

      <BlogCards blogs={blogs} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => dispatch(setCurrentPage(page))}
      />
    </div>
  );
}

export default Blog;
