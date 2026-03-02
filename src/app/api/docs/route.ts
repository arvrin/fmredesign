import { NextRequest, NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@/lib/openapi/generator';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const spec = generateOpenAPISpec();
  return NextResponse.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  });
}
