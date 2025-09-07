import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // Set this to your project DSN from Sentry.
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN!,

  // Adjust this value in production as needed.
  tracesSampleRate: 0.0,
  // Use profileSampleRate to enable profiling in the browser.
  profilesSampleRate: 0.0,

  // Capture errors in production only by default; keep enabled in dev if needed.
  enabled:
    process.env.NODE_ENV === "production" ||
    process.env.NEXT_PUBLIC_ENABLE_SENTRY === "true",

  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV!,
});
