export { auth as middleware } from "@/../../auth";

export const config = {
  matcher: [
    // Apply to all paths except static files, api routes that aren't auth
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
