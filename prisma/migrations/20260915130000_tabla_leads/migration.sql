-- Tabla de leads del sitio (formulario de contacto + checkout de servicios).
--
-- Antes lib/crm.js recibía el lead y no lo guardaba en ningún lado: el único
-- registro eran los emails. Un mail perdido o en spam era un lead perdido.
--
-- SQL de SQLite, igual que el resto del historial
-- (ver prisma/migrations/migration_lock.toml).

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "service" TEXT,
    "message" TEXT,
    "source" TEXT NOT NULL DEFAULT 'formulario_contacto',
    "reference" TEXT,
    "planId" TEXT,
    "amount" INTEGER,
    "termsAcceptedAt" DATETIME,
    "termsAcceptedIp" TEXT,
    "termsVersion" TEXT,
    "syncedToCrm" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

CREATE INDEX "Lead_source_idx" ON "Lead"("source");
