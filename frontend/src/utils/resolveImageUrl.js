const resolveImageUrl = (url) => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("//") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }

  if (url.startsWith("/")) {
    const publicPrefixes = [
      "/images/",
      "/logo/",
      "/videos/",
      "/whatwedo/",
      "/appdev-imgs/",
      "/ecom-imgs/",
      "/fintech-imgs/",
    ];

    if (publicPrefixes.some((prefix) => url.startsWith(prefix))) {
      return url;
    }

    const apiBase = import.meta.env.VITE_BASE_URL?.replace(/\/$/, "");
    return apiBase ? `${apiBase}${url}` : url;
  }

  return url;
};

export default resolveImageUrl;