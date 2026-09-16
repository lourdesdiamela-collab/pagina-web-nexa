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
  for (const p of products) {
    const categoryId = categoryIdBySlug.get(p.category);
    if (!categoryId) continue;
    await prisma.product.upsert({
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

    // El seed YA NO crea reseñas. Antes cargaba 3 reseñas inventadas por
    // producto, y como el rating mostrado es el promedio de esas 3 filas,
    // los ~100 recursos terminaban mostrando todos la misma valoración
    // idéntica: "4.7 (3)". Las reseñas ahora solo pueden venir de compradores
    // reales.
    //
    // OJO: esto no borra las reseñas falsas que ya estén cargadas en una base
    // existente. Para limpiarlas, correr: node prisma/limpiar-resenas-falsas.mjs
  }
  console.log(`Seed: ${products.length} productos sincronizados. No se crean reseñas (solo reseñas de compradores reales).`);

  const adminEmail = process.env.ADMIN_EMAIL || 'lu@nexaarg.com';
  const adminPassword = process.env.ADMIN_PASSWORD;
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin && !adminPassword) {
    // Antes, si ADMIN_PASSWORD no estaba cargada, el seed creaba el usuario
    // administrador con la contraseña 'CambiarInmediatamente123', escrita en
    // el código del repositorio. Cualquiera que leyera el repo podía entrar al
    // panel admin. Ahora el seed se niega a crear el admin sin contraseña.
    console.error(
      'Seed: NO se creó el usuario admin porque falta la variable ADMIN_PASSWORD.\n' +
      '      Cargala en .env.local (o en las variables de entorno del hosting) y volvé a correr el seed.',
    );
  } else if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Lu (Admin)',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    // No se loguea la contraseña: queda en el historial de la terminal y en
    // los logs de build del hosting.
    console.log(`Seed: usuario admin creado -> ${adminEmail} (con la contraseña de ADMIN_PASSWORD).`);
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
