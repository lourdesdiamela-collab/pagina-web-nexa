import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function requireSession(allowedRoles = []) {
  const session = await getSession();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: 'No autorizado' }, { status: 401 }) };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return { session: null, response: NextResponse.json({ error: 'No autorizado' }, { status: 403 }) };
  }

  return { session, response: null };
}
