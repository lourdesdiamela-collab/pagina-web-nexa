'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { requireAdminAction } from '@/lib/adminAuth';
import { saveFile, deleteFile } from '@/lib/storage';

function slugify(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* ── Productos ── */
export async function saveProduct(formData) {
  await requireAdminAction();

  const id = String(formData.get('id') || '');
  const title = String(formData.get('title') || '').trim();
  const slugInput = String(formData.get('slug') || '').trim();
  const slug = slugify(slugInput || title);
  const includesRaw = String(formData.get('includes') || '');
  const includes = includesRaw.split('\n').map((s) => s.trim()).filter(Boolean);

  const data = {
    slug,
    title,
    subtitle: String(formData.get('subtitle') || '').trim(),
    description: String(formData.get('description') || '').trim(),
    price: parseInt(formData.get('price'), 10) || 0,
    level: String(formData.get('level') || 'Todos los niveles'),
    pages: parseInt(formData.get('pages'), 10) || 0,
    readTime: String(formData.get('readTime') || ''),
    includes: JSON.stringify(includes),
    featured: formData.get('featured') === 'on',
    bestSeller: formData.get('bestSeller') === 'on',
    isNew: formData.get('isNew') === 'on',
    onSale: formData.get('onSale') === 'on',
    categoryId: String(formData.get('categoryId') || ''),
  };

  const pdf = formData.get('pdf');
  let newFileUrl;
  if (pdf && typeof pdf === 'object' && pdf.size > 0) {
    const buffer = Buffer.from(await pdf.arrayBuffer());
    newFileUrl = await saveFile(buffer, pdf.name || `${slug}.pdf`);
  }

  if (id) {
    if (newFileUrl) {
      const existing = await prisma.product.findUnique({ where: { id } });
      if (existing?.fileUrl) await deleteFile(existing.fileUrl).catch(() => {});
      data.fileUrl = newFileUrl;
    }
    await prisma.product.update({ where: { id }, data });
  } else {
    if (newFileUrl) data.fileUrl = newFileUrl;
    await prisma.product.create({ data });
  }

  revalidatePath('/aprende/admin/productos');
  revalidatePath('/aprende');
  redirect('/aprende/admin/productos');
}

export async function deleteProduct(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.fileUrl) await deleteFile(product.fileUrl).catch(() => {});
  await prisma.product.delete({ where: { id } });
  revalidatePath('/aprende/admin/productos');
  revalidatePath('/aprende');
}

/* ── Categorías ── */
export async function saveCategory(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const data = {
    slug: slugify(String(formData.get('slug') || formData.get('label') || '')),
    label: String(formData.get('label') || '').trim(),
    fullLabel: String(formData.get('fullLabel') || formData.get('label') || '').trim(),
    color: String(formData.get('color') || '#835CE6'),
    sortOrder: parseInt(formData.get('sortOrder'), 10) || 0,
  };
  if (id) {
    await prisma.category.update({ where: { id }, data });
  } else {
    await prisma.category.create({ data });
  }
  revalidatePath('/aprende/admin/categorias');
  revalidatePath('/aprende');
}

export async function deleteCategory(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    throw new Error('No se puede eliminar: hay productos en esta categoría.');
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath('/aprende/admin/categorias');
}

/* ── Pedidos ── */
export async function updateOrderStatus(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const status = String(formData.get('status') || '');
  if (!['PENDING', 'PENDING_TRANSFER', 'APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) return;

  if (status === 'APPROVED') {
    const { approveOrder } = await import('@/lib/orders');
    await approveOrder(id, {});
  } else {
    await prisma.order.update({ where: { id }, data: { status } });
  }
  revalidatePath('/aprende/admin/pedidos');
}

/* ── Usuarios ── */
export async function toggleUserRole(formData) {
  const session = await requireAdminAction();
  const id = String(formData.get('id') || '');
  if (id === session.user.id) throw new Error('No podés cambiar tu propio rol.');
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return;
  await prisma.user.update({ where: { id }, data: { role: user.role === 'ADMIN' ? 'USER' : 'ADMIN' } });
  revalidatePath('/aprende/admin/usuarios');
}

/* ── Reseñas ── */
export async function toggleReviewApproval(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) return;
  await prisma.review.update({ where: { id }, data: { approved: !review.approved } });
  revalidatePath('/aprende/admin/resenas');
  revalidatePath('/aprende');
}

export async function deleteReview(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  await prisma.review.delete({ where: { id } });
  revalidatePath('/aprende/admin/resenas');
  revalidatePath('/aprende');
}

/* ── Cupones ── */
export async function saveCoupon(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  const expiresAtRaw = String(formData.get('expiresAt') || '');
  const usageLimitRaw = String(formData.get('usageLimit') || '');
  const data = {
    code: String(formData.get('code') || '').trim().toUpperCase(),
    type: String(formData.get('type') || 'PERCENT'),
    value: parseInt(formData.get('value'), 10) || 0,
    active: formData.get('active') === 'on',
    expiresAt: expiresAtRaw ? new Date(expiresAtRaw) : null,
    usageLimit: usageLimitRaw ? parseInt(usageLimitRaw, 10) : null,
  };
  if (id) {
    await prisma.coupon.update({ where: { id }, data });
  } else {
    await prisma.coupon.create({ data });
  }
  revalidatePath('/aprende/admin/cupones');
}

export async function deleteCoupon(formData) {
  await requireAdminAction();
  const id = String(formData.get('id') || '');
  await prisma.coupon.delete({ where: { id } });
  revalidatePath('/aprende/admin/cupones');
}
