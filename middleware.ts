import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/monuments',
  '/monuments/(.*)',
]);
const isAdminApiRoute = createRouteMatcher(['/api/upload-auth']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes without authentication
  if (isPublicRoute(req)) return;

  // Handle API routes manually
  if (req.nextUrl.pathname.startsWith('/api')) {
    // Protect admin API routes
    if (isAdminApiRoute(req)) {
      const { userId } = await auth();
      if (!userId) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return;
    }
    
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } else {
    // Protect admin routes and other private pages
    if (isAdminRoute(req)) {
      await auth.protect();
    } else {
      // For other routes that aren't public, protect them
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
