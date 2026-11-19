import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/begrep/:id", destination: "/konsept/:id", permanent: false },
      { source: "/begrepsbanken", destination: "/konseptbanken", permanent: false },
    ];
  },
};

export default nextConfig;
