import { NextResponse } from 'next/server';

async function getAuthModule() {
  return require('@/lib/auth');
}

export async function GET() {
  try {
    const { getSession } = await getAuthModule();
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user: session });
  } catch {
    return NextResponse.json({ user: null });
  }
}
