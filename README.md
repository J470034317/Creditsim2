# Creditsim2

Credit simulation application with Base44 data integration.

## Setup

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Add your Base44 personal access token to `.env`:
   ```
   BASE44_TOKEN=your_token_here
   ```

### Fetch Data from Base44

Run locally:
```bash
npm run fetch-data
```

This will:
- Fetch all data from your Base44 app (ID: `6973d0f62a17a292b12b4106`)
- Save it to `data/base44-export-*.json`
- Create a summary in `data/export-summary.json`

### Automated Syncing

The repository includes a GitHub Actions workflow (`.github/workflows/sync-base44.yml`) that:
- Runs daily at 2 AM UTC
- Can be manually triggered via workflow_dispatch
- Automatically fetches and commits Base44 data updates

To enable automated syncing:
1. Add your Base44 token as a GitHub secret named `BASE44_TOKEN`
2. The workflow will automatically run on schedule

## Project Structure

```
creditsim2/
├── data/                      # Base44 exported data
│   ├── base44-export-*.json   # Timestamped data exports
│   └── export-summary.json    # Export metadata
├── fetch-base44-data.js       # Data fetching script
├── package.json               # Dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## Environment Variables

- `BASE44_TOKEN` - Your Base44 personal access token (required for data fetching)

## License

MIT
