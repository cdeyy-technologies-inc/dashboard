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

2. Copy the environment variables:
```bash
cp .env .env.backup
cp .env.local .env
```

3. Generate an auth secret and add it to .env:
```bash
openssl rand -base64 32
```

4. Install dependencies and run the development server:
```bash
npm install
npm run dev
```

The application will be available at http://localhost:3000

### Stopping the Database
To stop the PostgreSQL container:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```
