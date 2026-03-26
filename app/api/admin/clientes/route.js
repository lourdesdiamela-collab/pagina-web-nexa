import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/db';

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session || !['admin', 'team'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { company, contact_name, email, password, plan, service } = await request.json();

    if (!company || !email || !password) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
    }

    // Check if user exists
    const { data: existing } = await supabase.from('users').select('id').eq('email', email.toLowerCase()).single();
    if (existing) {
      return NextResponse.json({ error: 'Ya existe un usuario con este email' }, { status: 400 });
    }

    // Hash password
    const hash = bcrypt.hashSync(password, 10);
    
    // Create User
    const { data: newUser, error: userError } = await supabase.from('users').insert({
      email: email.toLowerCase(),
      password_hash: hash,
      role: 'client',
      name: contact_name || company
    }).select('id').single();

    if (userError) throw userError;

    // Create Client Record
    const { data: newClient, error: clientError } = await supabase.from('clients').insert({
      user_id: newUser.id,
      company,
      contact_name: contact_name || company,
      email: email.toLowerCase(),
      plan: plan || 'Growth',
      service: service || 'Marketing Integral'
    }).select('id').single();

    if (clientError) throw clientError;

    return NextResponse.json({ success: true, clientId: newClient.id });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session || !['admin', 'team'].includes(session.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, company, contact_name, email, plan, status')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ clients: clients || [] });
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
