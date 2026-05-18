import React from "react";

import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

function BlogContent({ blog }) {
  const blogUrl = window.location.href;

  return (
    <section className="w-full bg-[#f5f5f5] py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[90px_minmax(0,1fr)] gap-10">
          {/* SOCIAL SIDEBAR */}

          <div className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-gray-600 text-sm mb-3">Share it on</p>

              <div className="w-[72px] border border-gray-300 bg-white">
                {/* FACEBOOK */}

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    blogUrl,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaFacebookF />
                </a>

                {/* TWITTER */}

                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    blogUrl,
                  )}&text=${encodeURIComponent(blog.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaTwitter />
                </a>

                {/* LINKEDIN */}

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    blogUrl,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[72px] h-[72px] border-b border-gray-300 flex items-center justify-center text-black text-3xl hover:bg-black hover:text-white transition-all duration-300"
                >
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </div>

          {/* BLOG CONTENT */}

          <div className="max-w-5xl">
            {/* EXCERPT */}

            {blog.excerpt && (
              <p className="text-[1.15rem] leading-[1.9] text-[#4a4a4a] mb-10">
                {blog.excerpt}
              </p>
            )}

            {/* CONTENT */}

            <div
              className="
                prose
                prose-lg
                max-w-none

                prose-headings:text-[#222]
                prose-headings:font-semibold

                prose-p:text-[#4a4a4a]
                prose-p:leading-[1.9]

                prose-a:text-black

                prose-strong:text-black

                prose-img:rounded-none

                prose-h1:text-4xl
                prose-h2:text-3xl
                prose-h3:text-2xl
              "
              dangerouslySetInnerHTML={{
                __html: blog.content,
              }}
            />

            <div className="h-[10vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogContent;
