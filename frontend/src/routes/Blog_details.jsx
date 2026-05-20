import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import { getSingleBlog } from "../redux/slices/blogSlice";

import StretchHero from "../components/blog_components/StretchHero";

import BlogContent from "../components/blog_components/BlogContent";

function Blog_details() {
  const { blogSlug } = useParams();

  const dispatch = useDispatch();

  const { singleBlog, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(getSingleBlog(blogSlug));
  }, [dispatch, blogSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!singleBlog) {
    return null;
  }

  return (
    <div>
      <StretchHero blog={singleBlog} />

      <BlogContent blog={singleBlog} />
    </div>
  );
}

export default Blog_details;
