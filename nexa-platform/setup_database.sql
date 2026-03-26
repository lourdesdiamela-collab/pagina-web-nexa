-- Script de Inicialización de Base de Datos NEXA (PostgreSQL)
-- Copiá todo este texto y pegalo en el "SQL Editor" de tu proyecto Supabase (al menú izquierdo, el ícono />) y hacé click en "Run" (Correr).

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  plan TEXT,
  service TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT DEFAULT 'document',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insertar el usuario Administrador (La clave original se mantendrá "NexaAdmin2026!")
INSERT INTO users (id, email, password_hash, role, name) 
VALUES (
  '00000000-0000-0000-0000-000000000001', 
  'admin@nexagrowth.com.ar', 
  '$2a$10$wT0X80WJ1sQ7R/43WbBy2eeo4W7p0iHEx6A9WvXzH.9tK.tL7b4Xy', 
  'admin', 
  'Lourdes Alarcón'
) ON CONFLICT (email) DO NOTHING;

-- Insertar el Cliente de Prueba Demo (La clave será "ClienteDemo2026!")
INSERT INTO users (id, email, password_hash, role, name) 
VALUES (
  '00000000-0000-0000-0000-000000000002', 
  'cliente@demo.com', 
  '$2a$10$wT0X80WJ1sQ7R/43WbBy2eeo4W7p0iHEx6A9WvXzH.9tK.tL7b4Xy', 
  'client', 
  'Empresa Demo'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO clients (id, user_id, company, contact_name, email, plan, status)
VALUES (
  '00000000-0000-0000-0000-000000000010',
  '00000000-0000-0000-0000-000000000002',
  'Acme Corp',
  'Juan Pérez',
  'cliente@demo.com',
  'Growth',
  'active'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (client_id, title, description, status) VALUES 
('00000000-0000-0000-0000-000000000010', 'Brieffing Inicial', 'Completar formulario de marca', 'completed'),
('00000000-0000-0000-0000-000000000010', 'Estrategia de Contenidos', 'Aprobar grilla mensual', 'review'),
('00000000-0000-0000-0000-000000000010', 'Campaña Meta Ads', 'Revisar segmentación', 'in_progress');

INSERT INTO deliveries (client_id, title, status, type) VALUES 
('00000000-0000-0000-0000-000000000010', 'Manual de Marca v1', 'delivered', 'document'),
('00000000-0000-0000-0000-000000000010', 'Reporte Mensual Abril', 'pending', 'report');
