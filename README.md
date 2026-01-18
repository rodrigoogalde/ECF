# Set .env.local

```bash
sudo -u postgres psql

CREATE USER ecf WITH PASSWORD 'password';
CREATE DATABASE ecf_db OWNER ecf;
GRANT ALL PRIVILEGES ON DATABASE ecf_db TO ecf;

psql "postgresql://ecf:password@localhost:5432/ecf_db"

```

## Prisma

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```