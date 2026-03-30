import { NextResponse } from 'next/server';
import { requireSession } from '@/lib/api-auth';
import { getNotificationStatus, notifyEvent } from '@/lib/notifications';
import { getTrelloStatus, listTrelloSyncLog } from '@/lib/trello';

const ADMIN_ROLES = ['admin', 'team'];

export async function GET() {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const [trello, syncLog] = await Promise.all([
      getTrelloStatus(),
      listTrelloSyncLog(20),
    ]);

    const notifications = getNotificationStatus();

    return NextResponse.json({
      trello,
      notifications,
      syncLog,
    });
  } catch (error) {
    console.error('GET /api/admin/integraciones error:', error);
    return NextResponse.json({ error: 'No se pudo cargar estado de integraciones.' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await requireSession(ADMIN_ROLES);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const action = body.action;

    if (action === 'test_email') {
      const event = await notifyEvent({
        type: 'test_email',
        title: 'Prueba de email de NEXA CRM',
        message: 'Este mensaje confirma que la integracion de correo esta operativa.',
        details: { origen: 'panel_integraciones' },
      });
      return NextResponse.json({ success: true, event });
    }

    if (action === 'test_trello') {
      const status = await getTrelloStatus();
      return NextResponse.json({ success: true, trello: status });
    }

    return NextResponse.json({ error: 'Accion no soportada.' }, { status: 400 });
  } catch (error) {
    console.error('POST /api/admin/integraciones error:', error);
    return NextResponse.json({ error: 'No se pudo ejecutar la prueba.' }, { status: 500 });
  }
}
