# Elysia with Bun runtime
# POS sample
## Getting Started
To get started with this template, install the package with this command into your terminal:
```bash
bun i
```

Update the .env.local file and rename it to .env

Then migrate the schema to Database use this command:
```bash
bunx prisma migrate dev --name init
```
and
```bash
bunx prisma generate
```

## Development
To start the development server run:
```bash
bun dev
```

If you don't have bun you can use npm and npx instead 
And don't forget to create images folder inside your project

Open http://localhost:5001/ with your browser to see the result.