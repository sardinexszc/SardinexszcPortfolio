// @supabase/ssr defaults auth cookies to httpOnly: false so a browser client can read them.
// This app only talks to Supabase from the server, so the session never needs to be readable
// by page scripts; httpOnly keeps it out of reach of any injected script.
export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const;
