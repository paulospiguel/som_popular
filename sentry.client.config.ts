import * as Sentry from "@sentry/nextjs";

// Só inicializar o Sentry em produção
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    // Set this to your project DSN from Sentry.
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Adjust this value in production as needed.
    tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.0,

    // Use profileSampleRate to enable profiling in the browser.
    profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 0.0,

    // Add optional integrations for additional features
    integrations: [
      Sentry.replayIntegration({
        // Define how likely Replay events are sampled.
        // This sets the sample rate to be 10%. You may want this to be 100% while
        // in development and sample at a lower rate in production
        replaysSessionSampleRate: 0.1,

        // Define how likely Replay events are sampled when an error occurs.
        replaysOnErrorSampleRate: 1.0,
      }),
    ],

    // Enable logs to be sent to Sentry
    enableLogs: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,

    environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV!,
  });
}
