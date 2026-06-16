import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to handle CORS and iframe embedding for Space-Z platform preview
// This runs at the Next.js level, independent of the HTTP server runtime

export function middleware(request: NextRequest) {
  // Log the Origin and Host headers for debugging
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin) {
    console.log(`[middleware] Request with Origin: ${origin}, Host: ${host}`);
  }

  // Handle OPTIONS preflight requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set("Access-Control-Allow-Headers", "*");
    response.headers.set("Access-Control-Max-Age", "86400");
    response.headers.set("X-Frame-Options", "ALLOWALL");
    response.headers.set("Content-Security-Policy", "frame-ancestors *;");
    return response;
  }

  // Process the request and add iframe-friendly headers
  const response = NextResponse.next();

  // Allow iframe embedding from any origin
  response.headers.set("X-Frame-Options", "ALLOWALL");
  response.headers.set("Content-Security-Policy", "frame-ancestors *;");

  // CORS headers
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "*");

  return response;
}

export const config = {
  // Run on all routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
