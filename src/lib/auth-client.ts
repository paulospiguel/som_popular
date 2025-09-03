import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { APP_URL } from "@/constants";

import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: APP_URL,
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
