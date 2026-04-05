import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/db';
import { notifyEvent } from '@/lib/notifications';

export async function POST(request) {
  try {
    const { email, password, name, company, role, inviteCode } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres.' }, { status: 400 });
    }

    const adminInviteCode = process.env.NEXA_ADMIN_INVITE_CODE || 'NEXA2026';

    // Security check for Admin registration
    if (role === 'admin') {
      if (inviteCode !== adminInviteCode) {
        return NextResponse.json({ error: 'Código de invitación de agencia inválido.' }, { status: 403 });
      }
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return NextResponse.json({ error: 'Ya existe una cuenta con este email.' }, { status: 400 });
    }

    const hash = bcrypt.hashSync(password, 10);

    // Create User record
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email: email.toLowerCase(),
        password_hash: hash,
        role: role,
        name: name,
        is_active: true
      })
      .select('id')
      .single();

    if (userError || !newUser) {
      console.error(userError);
      return NextResponse.json({ error: 'No se pudo crear el usuario.' }, { status: 500 });
    }

    // If it's a client, automatically create their company entry in the CRM
    if (role === 'client') {
      if (!company) {
        return NextResponse.json({ error: 'El nombre de la empresa es obligatorio para clientes.' }, { status: 400 });
      }

      await supabaseAdmin.from('clients').insert({
        user_id: newUser.id,
        company: company,
        contact_name: name,
        email: email.toLowerCase(),
        plan: 'Growth',
        status: 'active'
      });
    }

    await notifyEvent({
      type: role === 'admin' ? 'nuevo_usuario_admin' : 'nuevo_usuario_cliente',
      title: role === 'admin' ? 'Nuevo usuario de equipo' : 'Nuevo registro de cliente',
      message: `${name} creó una cuenta en NEXA.`,
      details: { email: email.toLowerCase(), rol: role },
    });

    return NextResponse.json({ success: true, message: 'Cuenta creada con éxito.' });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
