export function getBaseUrl() {
  if (process.env.APP_URL) return `https://${process.env.APP_URL}`;
  if (process.env.PUBLIC_NEXT_APP_URL) return `https://${process.env.PUBLIC_NEXT_APP_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

export function getPublicUrl() {
  return getBaseUrl().replace("http://", "https://");
}

export function getBaseUri() {
  return getBaseUrl().replace(/^https?:\/\//, "");
}
