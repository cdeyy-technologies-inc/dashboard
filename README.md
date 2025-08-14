## Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

## Development with Docker

This project includes Docker Compose configuration for running a PostgreSQL database locally.

### Prerequisites
- Docker and Docker Compose installed

### Setup Instructions

1. Start the PostgreSQL container:
```bash
docker-compose up -d
```
2. Install dependencies and run the development server:
```bash
npm install
npm run dev
```

The application will be available at http://localhost:3000  

### Create Environment-Specific Files

How Next.js Loads Env Files

Loading Order & Priority (Highest to Lowest)

    .env.${NODE_ENV}.local - Environment-specific local overrides

    .env.local - General local overrides (not loaded when NODE_ENV=test)

    .env.${NODE_ENV} - Environment-specific settings

    .env - General defaults
Key Rules:

    .local files:

        Always ignored by Git (should be in .gitignore)

        Contain secrets/overrides

        .env.local takes precedence over .env.development

    Variable Exposure:

        Server-side only: Any variable without prefix

        Client-side exposure: Prefix with NEXT_PUBLIC_


Example for NODE_ENV=development (default for next dev)
text

.env.development.local → .env.local → .env.development → .env

Important Notes:

    Variable Prefix: Next.js only exposes variables prefixed with:

        NEXT_PUBLIC_ (client-side)

        No prefix (server-side only)    

Security: Never commit sensitive data in .env.local - add it to .gitignore:

Environment Detection: Next.js sets:

    NODE_ENV=development during next dev

    NODE_ENV=production during next build/next start        

#### To specify which .env file your Next.js project uses when running pnpm run dev, we need dotenv-cli

follow these steps:

1. Install dotenv-cli
bash

pnpm add -D dotenv-cli

2. Update package.json Scripts

Modify your dev script to load the specific .env file:
json

"scripts": {
  "dev": "dotenv -c local -- next dev",
  "dev:staging": "dotenv -c staging -- next dev",
  "dev:production": "dotenv -c production -- next dev"
}

3. Create Environment-Specific Files
text

.env.local           # For local development
.env.staging         # For staging environment
.env.production      # For production-like testing

4. Run with Selected Environment
bash

Uses .env.local
pnpm run dev

Uses .env.staging
pnpm run dev:staging

Alternative: Single Command with Argument

For dynamic environment selection:
json

"scripts": {
  "dev": "dotenv -c local -- next dev",
  "dev:env": "dotenv -c"
}

Then run:
bash

pnpm run dev:env -- staging next dev


### Stopping the Database
To stop the PostgreSQL container:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```
