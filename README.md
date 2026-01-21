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


```bash
/home/rodrigoogalde/UC/ECF/
├── content/                          # Contenido MDX separado del código
│   └── docs/
│       ├── M1/                       # Módulo 1: Matemáticas y Probabilidades
│       │   ├── MAT1610/              # Cálculo I
│       │   │   ├── index.mdx         # Intro del curso
│       │   │   ├── graficos-funciones.mdx
│       │   │   ├── derivadas.mdx
│       │   │   └── primitivas.mdx
│       │   ├── MAT1620/              # Cálculo II
│       │   ├── MAT1630/              # Cálculo III
│       │   ├── MAT1640/              # Ecuaciones Diferenciales
│       │   ├── MAT1203/              # Álgebra Lineal
│       │   └── EYP1113/              # Probabilidades
│       ├── M2/                       # Módulo 2: Ciencias Naturales
│       │   ├── FIS1514/              # Dinámica
│       │   ├── FIS1533/              # Electricidad y Magnetismo
│       │   ├── QIM100E/              # Química
│       │   └── FIS1523/              # Termodinámica
│       └── M3/                       # Módulo 3: Ingeniería
│           ├── ICS1513/              # Economía
│           ├── IIC1103/              # Programación
│           ├── hojas-calculo/        # Hojas de Cálculo
│           └── FIL188/               # Ética
│
├── src/app/
│   └── docs/
│       └── [...slug]/                # Catch-all route para /docs/M1/MAT1610/derivadas
│           └── page.tsx

```