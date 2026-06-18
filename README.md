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

### Available scripts

local e2e test:

    pnpm run test:localdb:up
    pnpm run dev

    pnpm run test:e2e

## MVP Scope: Law Case Management Initiative (2-Week Plan)

### Team Capacity
- Team size: **2 members** (`@ychgh` + Copilot agent support)
- Delivery window: **2 weeks**
- Start date: **2026-06-10**
- Target completion date: **2026-06-24**

### MVP Scope by Component

#### 1) KYC-ETL Project (Data Lake + Data Warehouse)
**In scope**
- Source connector for agreed MVP KYC data sources
- Scheduled ETL job (nightly + manual trigger)
- Basic data quality checks (required fields, schema conformance, duplicate detection)
- Curated warehouse tables consumed by Case-Management and Dashboard
- ETL status/events exposed for monitoring

**Dependencies**
- Access credentials and connectivity to KYC source systems
- Agreed canonical KYC schema
- Shared environment variables/secrets across ETL and Dashboard

#### 2) Case-Management Project (Customer-Facing App)
**In scope**
- Authentication and role-aware access for MVP users
- Case creation and case status tracking
- Core document metadata handling (upload reference + listing)
- Case timeline/notes for communication history
- Read integration with KYC profile data from warehouse/API

**Dependencies**
- KYC warehouse/API availability for profile lookups
- Shared case status model consumed by Dashboard
- Security/compliance controls for sensitive legal/customer data

#### 3) Dashboard Project (Internal-Facing App)
**In scope**
- Monitoring views for ETL job health (last run, duration, failures)
- KYC data freshness/integrity indicators
- Case operations overview (created/open/blocked/resolved trends)
- Basic alert surfaces for failed ETL and stale data

**Dependencies**
- ETL telemetry/event feed
- Case-Management metrics/events
- Internal authentication/authorization setup

### Integration Scope (Cross-Project)
- End-to-end flow: source KYC data → ETL → warehouse → case creation/update → dashboard monitoring
- Contract alignment across the three projects (schemas, status enums, identifiers)
- Minimum regression suite for core workflows and handoffs

### Two-Week Execution Plan (2 Members)

#### Week 1 (Build + Integrate Core Path)
- **Day 1-2**
  - Finalize MVP contracts (data schema, status enums, API/event payloads)
  - Confirm access to KYC sources and deployment environments
- **Day 3-4**
  - Implement ETL ingestion + transform + warehouse load for MVP entities
  - Build Case-Management: authentication + case create/status flow
- **Day 5**
  - Build Dashboard ETL/KYC baseline widgets
  - First integration test across ETL → warehouse → case app

#### Week 2 (Harden + Release)
- **Day 6-7**
  - Complete Case-Management document metadata + timeline/notes
  - Complete Dashboard case operations monitoring and alert surfaces
- **Day 8-9**
  - End-to-end validation, security/compliance checks, bug fixes
  - Stabilize deployment pipeline and run staged deployment rehearsal
- **Day 10**
  - Production MVP deployment
  - Release notes, operating runbook, and stakeholder handoff

### Ownership Split (Capacity-Aware)
- **Member 1 (`@ychgh`)**: Primary ETL + integration contracts + release gating
- **Member 2 (Copilot agent support)**: Dashboard + Case-Management implementation acceleration, test coverage, and documentation updates

### MVP Success Criteria
- Production deployment completed by **2026-06-24**
- Core ETL, Case-Management, and Dashboard flows are operational end-to-end
- Monitoring surfaces actionable ETL/KYC/Case signals with low false positives
- No critical security/compliance blockers at release time