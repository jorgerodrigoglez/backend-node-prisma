# Development
Pasos para levantar la app en desarrollo
node 20.9.0
npm run dev
1. Levantar la base de datos
```
docker compose up -d
```
2. Ejecutar el SEED para crear la DDBB local

# Prisma commnads
```
npx prisma init
npx prisma migrate dev
npx prisma generate

