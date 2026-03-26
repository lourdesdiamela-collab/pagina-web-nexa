import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwmwndjywojzrsjlsvey.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_k8nxCWMtqu2wB9BQawvxbw_2uq2JyV6';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndSeed() {
  console.log('Checking Supabase users...');
  const { data: users, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }

  console.log('Current users:', users.length);

  if (users.length === 0) {
    console.log('Seeding Admin User and Demo Client...');
    
    const admin = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@nexagrowth.com.ar',
      password_hash: '$2b$10$LmS3WELjj4.zibXhoKp1meLG3exBR5WlUdNrjTG3dhzRiV2rlJq8q',
      role: 'admin',
      name: 'Lourdes Alarcón'
    };
    
    const demo = {
      id: '00000000-0000-0000-0000-000000000002',
      email: 'cliente@demo.com',
      password_hash: '$2b$10$9f/UHX3owwmA4n/Lus1XSOtMjuJfGiRJjM0zpU4XWriBbyVkcYGdq',
      role: 'client',
      name: 'Empresa Demo'
    };

    const { error: insertUserError } = await supabase.from('users').insert([admin, demo]);
    if (insertUserError) console.error('Error inserting users:', insertUserError);

    // Seed Demo Client
    const demoClient = {
      id: '00000000-0000-0000-0000-000000000010',
      user_id: demo.id,
      company: 'Acme Corp',
      contact_name: 'Juan Pérez',
      email: 'cliente@demo.com',
      plan: 'Growth',
      status: 'active'
    };

    const { error: insertClientError } = await supabase.from('clients').insert([demoClient]);
    if (insertClientError) console.error('Error inserting client:', insertClientError);
    
    console.log('Seeding complete.');
  } else {
    console.log('Users exist. Skip seeding.');
  }
}

checkAndSeed();
