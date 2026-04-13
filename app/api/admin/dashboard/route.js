import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/db';
import { requireSession } from '@/lib/api-auth';
import { listPayments, listMovements, listFollowups, computeFinancialSummary } from '@/lib/crm';
import { listNotificationEvents } from '@/lib/notifications';

const ADMIN_ROLES = ['admin', 'team'];

export async function GET() {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const [clientsResult, tasksResult, followups, payments, movements, events] = await Promise.all([
      supabaseAdmin.from('clients').select('id,status,company,plan,created_at'),
      supabaseAdmin.from('tasks').select('id,status,priority,due_date,client_id'),
      listFollowups(),
      listPayments(),
      listMovements(),
      listNotificationEvents(10),
    ]);

    const clients = clientsResult.data || [];
    const tasks = tasksResult.data || [];
    const summary = computeFinancialSummary(payments, movements);

    const today = new Date();
    const overdueTasks = tasks.filter((task) => task.due_date && task.status !== 'completed' && new Date(task.due_date) < today).length;
    const openTasks = tasks.filter((task) => task.status !== 'completed').length;
    const completedTasks = tasks.filter((task) => task.status === 'completed').length;
    const openFollowups = followups.filter((item) => item.status !== 'cerrado').length;
    const activeClients = clients.filter((client) => client.status === 'active').length;

    const latestClients = [...clients]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return NextResponse.json({
      kpis: {
        totalClients: clients.length,
        activeClients,
        openTasks,
        completedTasks,
        overdueTasks,
        openFollowups,
        pendingPayments: summary.pendingPayments,
        balance: summary.balance,
      },
      financials: summary,
      latestClients,
      events,
    });
  } catch (error) {
    console.error('GET /api/admin/dashboard error:', error);
    return NextResponse.json({ error: 'No se pudo cargar el dashboard.' }, { status: 500 });
  }
}
