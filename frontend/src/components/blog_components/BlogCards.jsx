import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Pagination from "./Pagination";

import { getBlogs } from "../../redux/slices/blogSlice";

function BlogCards({ blogs = [], section = null }) {
  const cardsRef = useRef([]);
  const dispatch = useDispatch();

  const [localBlogs, setLocalBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (page) => {
    if (!section) return;
    const res = await dispatch(getBlogs({ page, sectionId: section._id }));
    if (res.meta.requestStatus === "fulfilled") {
      const payload = res.payload || {};
      const dataArr = Array.isArray(payload.data)
        ? payload.data
        : (payload.data?.blogs ?? payload.data ?? []);
      setLocalBlogs(dataArr);
      const pg =
        payload.pagination?.currentPage ?? payload.data?.currentPage ?? 1;
      const tp =
        payload.pagination?.totalPages ?? payload.data?.totalPages ?? 1;
      setCurrentPage(pg);
      setTotalPages(tp);
    }
  };

  useEffect(() => {
    if (section) {
      setCurrentPage(1);
      fetchPage(1);
    }
  }, [dispatch, section]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");

            entry.target.classList.remove("opacity-0", "translate-y-20");
          }
        });
      },
      {
        threshold: 0.15,
      },
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [blogs]);
  const finalBlogs = section ? localBlogs : blogs;

  return (
    <section className="w-full px-5 md:px-8 lg:px-10 py-10 bg-[#fafafa]">
      {/* GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
        {finalBlogs.map((blog, index) => (
          <Link
            key={blog._id}
            to={`/${section?.pageSlug || "blog"}/${blog.slug}`}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group block opacity-0 translate-y-20 transition-all duration-700 ease-out"
          >
            {/* IMAGE */}

            <div className="overflow-hidden bg-gray-200">
              <img
                src={blog.coverImage}
                alt={blog.title}
                loading="lazy"
                className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* TEXT */}

            <div className="pt-3">
              <h2 className="text-[1.25rem] leading-[1.2] font-[350] text-[#2d2d2d]">
                {blog.title}

                <span className="text-gray-500 font-[300]">
                  {" "}
                  | {new Date(blog.publishedAt).toLocaleDateString()}
                </span>
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination for section-scoped blogs */}
      {section && (
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(p) => fetchPage(p)}
          />
        </div>
      )}
    </section>
  );
}

export default BlogCards;
