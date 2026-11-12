// Public address of the website. Set NEXT_PUBLIC_SITE_URL in production (for example https://www.yourdomain.com).
export const baseUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
