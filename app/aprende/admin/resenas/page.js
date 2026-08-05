import { prisma } from '@/lib/db';
import { toggleReviewApproval, deleteReview } from '@/lib/adminActions';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { title: true } } },
    take: 200,
  });

  return (
    <>
      <h1>Reseñas</h1>
      <p className="admin-subtitle">{reviews.length} reseñas (últimas 200). Las no aprobadas no se muestran en la tienda ni cuentan para el rating.</p>

      <div className="aprende-admin-card">
        <div className="aprende-admin-table-wrap">
          <table className="aprende-admin-table">
            <thead><tr><th>Producto</th><th>Nombre</th><th>Rating</th><th>Comentario</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r.id}>
                  <td>{r.product?.title || '—'}</td>
                  <td>{r.name}</td>
                  <td>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                  <td style={{ maxWidth: 320 }}>{r.comment}</td>
                  <td>{r.approved ? 'Aprobada' : 'Oculta'}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    <form action={toggleReviewApproval}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="aprende-btn-mini">{r.approved ? 'Ocultar' : 'Aprobar'}</button>
                    </form>
                    <form action={deleteReview}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="aprende-btn-mini danger">Eliminar</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
