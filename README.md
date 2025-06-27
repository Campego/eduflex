# comando para instalar dependencias necesarias 
npm install --legacy-peer-deps
#Para generar la base de datos
npm run db:push 
#poblar db de datos
npm run db:prod


#.env 

-- deshabilitar next.js telemetry
NEXT_TELEMETRY_DISABLED=1

-- Keys Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

-- url de postgres (se saca del neon)
DATABASE_URL= 

-- stripe api key y webhook
STRIPE_API_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

-- public app url
NEXT_PUBLIC_APP_URL=http://localhost:3000

-- usuario admin de clerk
CLERK_ADMIN_IDS=
