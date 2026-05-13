import React from "react";
import BlogTagLine from "../components/blog_components/BlogTagLine";
import BlogCards from "../components/blog_components/BlogCards";
import Pagination from "../components/blog_components/Pagination";

function Blog() {
  return (
    <div>
      <BlogTagLine />
      <BlogCards />
      <Pagination />
    </div>
  );
}

export default Blog;
