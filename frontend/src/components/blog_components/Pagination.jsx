import React, { useState } from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageChange = (page) => {
    onPageChange(page);
  };

  return (
    <div className="w-full flex justify-center items-center py-14 bg-[#fafafa]">
      <div className="flex items-center gap-8 text-[1.1rem] font-[350] text-gray-500">
        {/* Previous */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`transition-all duration-300 ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:text-black"
          }`}
        >
          ‹
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-8">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`transition-all duration-300 ${
                  currentPage === page
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`transition-all duration-300 ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:text-black"
          }`}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default Pagination;
