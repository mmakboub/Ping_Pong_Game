#!/bin/bash
POSTGRES_USER=admin
POSTGRES_DB=nestjs
POSTGRES_HOST=postgres
POSTGRES_PORT=5432

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 1
done

npx prisma migrate dev --name push && npm run build

npx prisma studio --port 5555 &

exec $@
