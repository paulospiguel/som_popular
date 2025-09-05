export function getBaseUrl() {
  if (process.env.APP_URL) return process.env.APP_URL;
  if (process.env.PUBLIC_NEXT_APP_URL) return process.env.PUBLIC_NEXT_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";

  return "http://localhost:3000";
}
