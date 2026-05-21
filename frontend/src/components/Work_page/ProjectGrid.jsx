import React, { useState, useMemo } from "react";
import ProjectCard from "./ProjectCard";

const ProjectGrid = ({ projects }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage =14;
  
  // Calculate pagination
  const totalPages = Math.ceil(projects.length / cardsPerPage);
  
  // Get current page projects
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    return projects.slice(startIndex, endIndex);
  }, [projects, currentPage]);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        end = 4;
      }
      
      if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No projects found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-[18px] md:grid-cols-2 mb-8">
        {currentProjects.map((project, index) => (
          <ProjectCard key={`${project.title}-${index}`} project={project} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8 mb-12">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-300
              ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }
            `}
            aria-label="Previous page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => {
                  if (page !== '...') {
                    handlePageChange(page);
                  }
                }}
                disabled={page === '...'}
                className={`
                  min-w-[40px] h-10 px-2 rounded-lg text-sm font-medium
                  transition-all duration-300
                  ${
                    page === currentPage
                      ? "bg-black text-white shadow-md"
                      : page === '...'
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-gray-100 hover:text-black"
                  }
                `}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium
              transition-all duration-300
              ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed bg-gray-100"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }
            `}
            aria-label="Next page"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Optional: Show current page info */}
      <div className="text-center text-sm text-gray-500 mt-2">
        Showing {((currentPage - 1) * cardsPerPage) + 1}-
        {Math.min(currentPage * cardsPerPage, projects.length)} of {projects.length} projects
      </div>
    </div>
  );
};

export default ProjectGrid;