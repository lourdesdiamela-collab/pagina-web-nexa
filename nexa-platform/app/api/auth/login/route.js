import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son obligatorios.' }, { status: 400 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales incorrectas.' }, { status: 401 });
    }

    // Get client info if role is client
    let clientId = null;
    if (user.role === 'client') {
      const { data: client } = await supabase.from('clients').select('id').eq('user_id', user.id).single();
      clientId = client?.id;
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      clientId,
    });

    const response = NextResponse.json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role },
      redirect: user.role === 'client' ? '/clientes/dashboard' : '/admin/dashboard',
    });

    response.cookies.set('nexa_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
