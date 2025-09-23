import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { getBaseUrl } from "@/services/url/base-url";

import { auth } from "./auth";
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [inferAdditionalFields<typeof auth>()],
});

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  forgetPassword,
  resetPassword,
} = authClient;

export const requestPasswordReset = forgetPassword;
