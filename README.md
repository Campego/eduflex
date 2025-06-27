# Comandos para desarrollo

### Instalar dependencias necesarias

npm install --legacy-peer-deps

### Generar la base de datos

npm run db:push

### Poblar la base de datos

npm run db:prod


### ENV

Deshabilitar la telemetría de Next.js

NEXT_TELEMETRY_DISABLED=1

Claves de Clerk

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY= \
CLERK_SECRET_KEY=

URL de conexión a PostgreSQL (desde Neon)

DATABASE_URL=

Stripe API Key y Webhook Secret

STRIPE_API_SECRET_KEY= \
STRIPE_WEBHOOK_SECRET=

URL pública de la aplicación (modo desarrollo)

NEXT_PUBLIC_APP_URL=http://localhost:3000

ID de usuario administrador de Clerk (separar por comas si hay varios)

CLERK_ADMIN_IDS=
