import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { CATEGORIES, listProducts } from '../lib/products.mjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed: sincronizando categorías...');
  const categoryIdBySlug = new Map();

  for (let i = 0; i < CATEGORIES.length; i += 1) {
    const cat = CATEGORIES[i];
    const row = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { label: cat.label, fullLabel: cat.fullLabel, color: cat.color, sortOrder: i },
      create: { slug: cat.slug, label: cat.label, fullLabel: cat.fullLabel, color: cat.color, sortOrder: i },
    });
    categoryIdBySlug.set(cat.slug, row.id);
  }

  console.log('Seed: sincronizando productos...');
  const products = listProducts();
  let reviewsCreated = 0;
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) continue;
    const row = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        level: p.level,
        pages: p.pages,
        readTime: p.readTime,
        includes: JSON.stringify(p.includes),
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        isNew: !!p.isNew,
        onSale: !!p.deal,
        categoryId,
      },
      create: {
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        price: p.price,
        level: p.level,
        pages: p.pages,
        readTime: p.readTime,
        includes: JSON.stringify(p.includes),
        featured: !!p.featured,
        bestSeller: !!p.bestSeller,
        isNew: !!p.isNew,
        onSale: !!p.deal,
        fileUrl: null,
        categoryId,
      },
    });

    // Reseñas de ejemplo (solo la primera vez — si el producto ya tiene
    // reseñas cargadas, no se duplican en cada re-seed).
    const existingReviews = await prisma.review.count({ where: { productId: row.id } });
    if (existingReviews === 0 && Array.isArray(p.reviews) && p.reviews.length > 0) {
      await prisma.review.createMany({
        data: p.reviews.map((r) => ({
          productId: row.id,
          name: r.name,
          rating: r.rating,
          comment: r.comment,
          approved: true,
          createdAt: new Date(r.date),
        })),
      });
      reviewsCreated += p.reviews.length;
    }
  }
  console.log(`Seed: ${products.length} productos sincronizados, ${reviewsCreated} reseñas de ejemplo creadas.`);

  const adminEmail = process.env.ADMIN_EMAIL || 'lu@nexaarg.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'CambiarInmediatamente123';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Lu (Admin)',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`Seed: usuario admin creado -> ${adminEmail} / ${adminPassword} (¡cambiar la contraseña luego de ingresar!)`);
  } else if (existingAdmin.role !== 'ADMIN') {
    await prisma.user.update({ where: { email: adminEmail }, data: { role: 'ADMIN' } });
    console.log(`Seed: usuario existente ${adminEmail} promovido a ADMIN.`);
  } else {
    console.log(`Seed: admin ${adminEmail} ya existe.`);
  }

  const demoCoupon = await prisma.coupon.findUnique({ where: { code: 'BIENVENIDA10' } });
  if (!demoCoupon) {
    await prisma.coupon.create({
      data: { code: 'BIENVENIDA10', type: 'PERCENT', value: 10, active: true },
    });
    console.log('Seed: cupón de ejemplo BIENVENIDA10 (10% OFF) creado.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
