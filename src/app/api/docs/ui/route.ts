import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>FreakingMinds API Documentation</title>
  <style>
    body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <script id="api-reference" data-url="${siteUrl}/api/docs"></script>
  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
