-- NEXA operational CRM migration
-- Scope:
-- 1) Move local JSON-backed entities to Supabase tables
-- 2) Add indexes and audit log
-- 3) Enable RLS with service-role full access and authenticated read access where safe

create extension if not exists pgcrypto;

create schema if not exists crm;

create or replace function crm.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists crm.client_meta (
  client_id uuid primary key references public.clients(id) on delete cascade,
  start_date timestamptz null,
  end_date timestamptz null,
  duration_days integer null,
  service_mode text not null default 'fixed' check (service_mode in ('fixed', 'temporary')),
  category text not null default '',
  responsible text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.followups (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  comment text not null,
  next_step text not null default '',
  reminder_at timestamptz null,
  status text not null default 'abierto' check (status in ('abierto', 'en_proceso', 'cerrado')),
  owner text not null default '',
  attachments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.payments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid null references public.clients(id) on delete set null,
  concept text not null,
  amount numeric(14,2) not null check (amount >= 0),
  currency text not null default 'ARS',
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'partial')),
  method text not null default 'transferencia',
  due_date timestamptz null,
  paid_at timestamptz null,
  reference text not null default '',
  notes text not null default '',
  attachment_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.financial_movements (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income', 'expense')),
  category text not null default 'general',
  concept text not null,
  amount numeric(14,2) not null check (amount >= 0),
  date timestamptz not null default now(),
  client_id uuid null references public.clients(id) on delete set null,
  status text not null default 'registrado',
  notes text not null default '',
  attachment_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null default '',
  service text not null default '',
  challenge text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists crm.notification_events (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'general',
  title text not null default 'Evento CRM',
  message text not null default '',
  severity text not null default 'info',
  details jsonb not null default '{}'::jsonb,
  email jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists crm.trello_task_map (
  task_id uuid primary key references public.tasks(id) on delete cascade,
  card_id text not null,
  list_id text null,
  board_id text null,
  synced_at timestamptz not null default now()
);

create table if not exists crm.trello_sync_log (
  id bigserial primary key,
  task_id uuid null references public.tasks(id) on delete set null,
  action text not null default 'upsert',
  operation text null,
  card_id text null,
  ok boolean not null default false,
  reason text null,
  created_at timestamptz not null default now()
);

create table if not exists crm.audit_log (
  id bigserial primary key,
  schema_name text not null,
  table_name text not null,
  action text not null,
  record_id text null,
  new_data jsonb null,
  old_data jsonb null,
  created_at timestamptz not null default now()
);

create or replace function crm.write_audit_log()
returns trigger
language plpgsql
as $$
declare
  v_record_id text;
begin
  if tg_op = 'DELETE' then
    v_record_id = coalesce(old.id::text, old.client_id::text, null);
    insert into crm.audit_log (schema_name, table_name, action, record_id, old_data)
    values (tg_table_schema, tg_table_name, tg_op, v_record_id, to_jsonb(old));
    return old;
  else
    v_record_id = coalesce(new.id::text, new.client_id::text, null);
    insert into crm.audit_log (schema_name, table_name, action, record_id, new_data, old_data)
    values (tg_table_schema, tg_table_name, tg_op, v_record_id, to_jsonb(new), case when tg_op = 'UPDATE' then to_jsonb(old) else null end);
    return new;
  end if;
end;
$$;

-- Indexes
create index if not exists idx_followups_client_id on crm.followups(client_id);
create index if not exists idx_followups_status on crm.followups(status);
create index if not exists idx_followups_reminder_at on crm.followups(reminder_at);

create index if not exists idx_payments_client_id on crm.payments(client_id);
create index if not exists idx_payments_status on crm.payments(status);
create index if not exists idx_payments_due_date on crm.payments(due_date);
create index if not exists idx_payments_created_at on crm.payments(created_at desc);

create index if not exists idx_financial_movements_type on crm.financial_movements(type);
create index if not exists idx_financial_movements_date on crm.financial_movements(date desc);
create index if not exists idx_financial_movements_client_id on crm.financial_movements(client_id);

create index if not exists idx_leads_created_at on crm.leads(created_at desc);
create index if not exists idx_notification_events_created_at on crm.notification_events(created_at desc);
create index if not exists idx_trello_sync_log_created_at on crm.trello_sync_log(created_at desc);
create index if not exists idx_audit_log_created_at on crm.audit_log(created_at desc);

-- updated_at triggers
drop trigger if exists trg_client_meta_updated_at on crm.client_meta;
create trigger trg_client_meta_updated_at before update on crm.client_meta for each row execute function crm.set_updated_at();

drop trigger if exists trg_followups_updated_at on crm.followups;
create trigger trg_followups_updated_at before update on crm.followups for each row execute function crm.set_updated_at();

drop trigger if exists trg_payments_updated_at on crm.payments;
create trigger trg_payments_updated_at before update on crm.payments for each row execute function crm.set_updated_at();

drop trigger if exists trg_financial_movements_updated_at on crm.financial_movements;
create trigger trg_financial_movements_updated_at before update on crm.financial_movements for each row execute function crm.set_updated_at();

-- audit triggers
drop trigger if exists trg_audit_client_meta on crm.client_meta;
create trigger trg_audit_client_meta after insert or update or delete on crm.client_meta for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_followups on crm.followups;
create trigger trg_audit_followups after insert or update or delete on crm.followups for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_payments on crm.payments;
create trigger trg_audit_payments after insert or update or delete on crm.payments for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_financial_movements on crm.financial_movements;
create trigger trg_audit_financial_movements after insert or update or delete on crm.financial_movements for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_leads on crm.leads;
create trigger trg_audit_leads after insert or update or delete on crm.leads for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_notification_events on crm.notification_events;
create trigger trg_audit_notification_events after insert or update or delete on crm.notification_events for each row execute function crm.write_audit_log();

drop trigger if exists trg_audit_trello_task_map on crm.trello_task_map;
create trigger trg_audit_trello_task_map after insert or update or delete on crm.trello_task_map for each row execute function crm.write_audit_log();

-- RLS helpers
create or replace function crm.is_team_user()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users u
    where lower(u.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and u.is_active = true
      and u.role in ('admin', 'team')
  );
$$;

create or replace function crm.is_client_owner(p_client_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.clients c
    join public.users u on u.id = c.user_id
    where c.id = p_client_id
      and lower(u.email) = lower(coalesce(auth.jwt()->>'email', ''))
      and u.is_active = true
      and u.role = 'client'
  );
$$;

-- Enable RLS on core and crm tables
alter table public.users enable row level security;
alter table public.clients enable row level security;
alter table public.tasks enable row level security;
alter table public.deliveries enable row level security;

alter table crm.client_meta enable row level security;
alter table crm.followups enable row level security;
alter table crm.payments enable row level security;
alter table crm.financial_movements enable row level security;
alter table crm.leads enable row level security;
alter table crm.notification_events enable row level security;
alter table crm.trello_task_map enable row level security;
alter table crm.trello_sync_log enable row level security;
alter table crm.audit_log enable row level security;

-- Drop policies if rerun
drop policy if exists p_users_service_all on public.users;
drop policy if exists p_clients_service_all on public.clients;
drop policy if exists p_clients_team_read on public.clients;
drop policy if exists p_clients_owner_read on public.clients;
drop policy if exists p_tasks_service_all on public.tasks;
drop policy if exists p_tasks_team_read on public.tasks;
drop policy if exists p_tasks_owner_read on public.tasks;
drop policy if exists p_deliveries_service_all on public.deliveries;
drop policy if exists p_deliveries_team_read on public.deliveries;
drop policy if exists p_deliveries_owner_read on public.deliveries;

drop policy if exists p_client_meta_service_all on crm.client_meta;
drop policy if exists p_client_meta_team_read on crm.client_meta;
drop policy if exists p_client_meta_owner_read on crm.client_meta;
drop policy if exists p_followups_service_all on crm.followups;
drop policy if exists p_followups_team_read on crm.followups;
drop policy if exists p_followups_owner_read on crm.followups;
drop policy if exists p_payments_service_all on crm.payments;
drop policy if exists p_payments_team_read on crm.payments;
drop policy if exists p_payments_owner_read on crm.payments;
drop policy if exists p_financial_movements_service_all on crm.financial_movements;
drop policy if exists p_leads_service_all on crm.leads;
drop policy if exists p_notification_events_service_all on crm.notification_events;
drop policy if exists p_trello_task_map_service_all on crm.trello_task_map;
drop policy if exists p_trello_sync_log_service_all on crm.trello_sync_log;
drop policy if exists p_audit_log_service_all on crm.audit_log;

-- service role full access
create policy p_users_service_all on public.users for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_clients_service_all on public.clients for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_tasks_service_all on public.tasks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_deliveries_service_all on public.deliveries for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy p_client_meta_service_all on crm.client_meta for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_followups_service_all on crm.followups for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_payments_service_all on crm.payments for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_financial_movements_service_all on crm.financial_movements for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_leads_service_all on crm.leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_notification_events_service_all on crm.notification_events for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_trello_task_map_service_all on crm.trello_task_map for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_trello_sync_log_service_all on crm.trello_sync_log for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy p_audit_log_service_all on crm.audit_log for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- authenticated read access (optional, future-facing)
create policy p_clients_team_read on public.clients for select using (crm.is_team_user());
create policy p_clients_owner_read on public.clients for select using (crm.is_client_owner(id));

create policy p_tasks_team_read on public.tasks for select using (crm.is_team_user());
create policy p_tasks_owner_read on public.tasks for select using (crm.is_client_owner(client_id));

create policy p_deliveries_team_read on public.deliveries for select using (crm.is_team_user());
create policy p_deliveries_owner_read on public.deliveries for select using (crm.is_client_owner(client_id));

create policy p_client_meta_team_read on crm.client_meta for select using (crm.is_team_user());
create policy p_client_meta_owner_read on crm.client_meta for select using (crm.is_client_owner(client_id));

create policy p_followups_team_read on crm.followups for select using (crm.is_team_user());
create policy p_followups_owner_read on crm.followups for select using (crm.is_client_owner(client_id));

create policy p_payments_team_read on crm.payments for select using (crm.is_team_user());
create policy p_payments_owner_read on crm.payments for select using (client_id is not null and crm.is_client_owner(client_id));

drop policy if exists p_financial_movements_team_read on crm.financial_movements;
drop policy if exists p_leads_team_read on crm.leads;
drop policy if exists p_notification_events_team_read on crm.notification_events;
drop policy if exists p_trello_task_map_team_read on crm.trello_task_map;
drop policy if exists p_trello_sync_log_team_read on crm.trello_sync_log;
drop policy if exists p_audit_log_team_read on crm.audit_log;

create policy p_financial_movements_team_read on crm.financial_movements for select using (crm.is_team_user());
create policy p_leads_team_read on crm.leads for select using (crm.is_team_user());
create policy p_notification_events_team_read on crm.notification_events for select using (crm.is_team_user());
create policy p_trello_task_map_team_read on crm.trello_task_map for select using (crm.is_team_user());
create policy p_trello_sync_log_team_read on crm.trello_sync_log for select using (crm.is_team_user());
create policy p_audit_log_team_read on crm.audit_log for select using (crm.is_team_user());

grant usage on schema crm to authenticated;
grant usage on schema crm to service_role;

grant all on all tables in schema crm to service_role;
grant all on all sequences in schema crm to service_role;

grant select on crm.client_meta to authenticated;
grant select on crm.followups to authenticated;
grant select on crm.payments to authenticated;
grant select on crm.financial_movements to authenticated;
grant select on crm.notification_events to authenticated;
grant select on crm.trello_task_map to authenticated;
grant select on crm.trello_sync_log to authenticated;
grant select on crm.audit_log to authenticated;
grant select on crm.leads to authenticated;
