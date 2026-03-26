import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !['admin', 'team'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // This is a mockup of financial data since we don't have a full billing system yet
    // In production, we would sum up from 'payments' and 'expenses' tables
    const financials = {
      income: 2450000,
      expenses: 850000,
      campaignSpend: 320000,
      history: [
        { month: 'Ene', income: 1800000, expenses: 700000 },
        { month: 'Feb', income: 2100000, expenses: 750000 },
        { month: 'Mar', income: 2450000, expenses: 850000 },
      ]
    };

    return NextResponse.json(financials);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener finanzas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || !['admin', 'team'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const data = await request.json();
    // Logic to save manual adjustment or expense
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar dato' }, { status: 500 });
  }
}
