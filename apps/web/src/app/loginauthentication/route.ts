import { NextResponse } from "next/server";

function getBackendLoginUrl(): URL {
  const configuredApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (!configuredApiUrl) {
    throw new Error("Set API_URL to the deployed Laravel API URL.");
  }

  const backendOrigin = new URL(configuredApiUrl).origin;
  return new URL("/loginauthentication", backendOrigin);
}

export function GET(request: Request) {
  try {
    const destination = getBackendLoginUrl();
    destination.search = new URL(request.url).search;
    return NextResponse.redirect(destination);
  } catch {
    return new NextResponse("Login is unavailable because the Laravel API URL is not configured.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
