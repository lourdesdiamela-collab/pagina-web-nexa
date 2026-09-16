-- Aceptación de Términos y Condiciones en el checkout.
--
-- Guarda quién aceptó (el userId del pedido), cuándo (termsAcceptedAt), desde
-- dónde (termsAcceptedIp) y qué versión del texto estaba vigente
-- (termsVersion), para poder demostrarlo ante un reclamo.
--
-- Las tres columnas son opcionales, así que los pedidos ya existentes quedan
-- con NULL y la migración no rompe nada.
--
-- OJO: esta migración está escrita en SQL de SQLite, igual que el resto del
-- historial (ver prisma/migrations/migration_lock.toml). Si se pasa la base a
-- Postgres, hay que regenerar el historial de migraciones: en Postgres el tipo
-- es TIMESTAMP(3) en lugar de DATETIME.

ALTER TABLE "Order" ADD COLUMN "termsAcceptedAt" DATETIME;
ALTER TABLE "Order" ADD COLUMN "termsAcceptedIp" TEXT;
ALTER TABLE "Order" ADD COLUMN "termsVersion" TEXT;
