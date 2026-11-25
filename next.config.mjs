/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.targetpaymentbenefits.com" }],
        destination: "https://targetpaymentbenefits.com/:path*",
        permanent: true,
      },
      { source: "/login", destination: "/", permanent: true },
      { source: "/logon", destination: "/", permanent: true },
      { source: "/target-pay-and-benefits-login", destination: "/", permanent: true },
      { source: "/paystub", destination: "/payslip", permanent: true },
      { source: "/401k-login", destination: "/401k", permanent: true },
      { source: "/tgt401k", destination: "/401k", permanent: true },
      { source: "/reset", destination: "/forgot-password", permanent: true },
      { source: "/health", destination: "/benefits/health", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
