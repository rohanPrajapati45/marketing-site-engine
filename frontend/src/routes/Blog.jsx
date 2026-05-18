import React from "react";
import BlogTagLine from "../components/blog_components/BlogTagLine";
import BlogCards from "../components/blog_components/BlogCards";
import Pagination from "../components/blog_components/Pagination";
import AgencyTagLine from "../components/agency_components/AgencyTagLine";

function Blog() {
  return (
    <div>
      <AgencyTagLine />
      <BlogCards />
      <Pagination />
    </div>
  );
}

export default Blog;
