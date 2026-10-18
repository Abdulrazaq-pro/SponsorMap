# SponsorMap

AI-native sponsorship operations and performance reporting for event organizers: extract commitments from sponsorship agreements, assign fulfilment tasks, collect evidence, and generate sponsor-ready reports that separate recorded metrics from estimates.

> **Status: work in progress.** The public website, interactive fulfilment demo and dashboard overview are built. Remaining dashboard pages, API routes (Bedrock extraction, S3 uploads, HubSpot demo requests), PostgreSQL schema and Lambda functions are not yet implemented.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3100. See `.env.example` for optional AWS and HubSpot settings.

## Principles

- The platform never generates reach, impressions, engagement or proof of delivery.
- Every metric is labelled **Recorded** (linked to a source) or **Estimate** (with its method).
- Important extracted commitments require human review before they are tracked or reported.

All organizations, people and figures in the demo data are fictional.
