import { createClient } from '@base44/sdk';
import fs from 'fs';
import path from 'path';

const appId = '6973d0f62a17a292b12b4106';
const token = process.env.BASE44_TOKEN;

if (!token) {
  console.error('Missing BASE44_TOKEN environment variable.');
  console.error('Set it with: export BASE44_TOKEN="your_token"');
  process.exit(1);
}

const base44 = createClient({
  appId,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

async function fetchBase44Data() {
  const exportDir = path.join(process.cwd(), 'data');
  fs.mkdirSync(exportDir, { recursive: true });

  const possibleFetchers = [
    () => base44.getAllData?.(),
    () => base44.getData?.(),
    () => base44.fetchAll?.(),
    () => base44.list?.(),
    () => base44.api?.getAllData?.(),
    () => base44.api?.data?.getAll?.(),
  ];

  let result;
  for (const fetcher of possibleFetchers) {
    if (typeof fetcher !== 'function') continue;
    try {
      result = await fetcher();
      if (result !== undefined) break;
    } catch {
      // continue to next fallback strategy
    }
  }

  if (result === undefined) {
    throw new Error('Unable to find a supported Base44 data-fetch method. Check the SDK version or API shape.');
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `base44-export-${timestamp}.json`;
  const filePath = path.join(exportDir, fileName);
  const summaryPath = path.join(exportDir, 'export-summary.json');

  fs.writeFileSync(filePath, JSON.stringify(result, null, 2));

  const summary = {
    appId,
    exportedAt: new Date().toISOString(),
    file: fileName,
    count: Array.isArray(result) ? result.length : Object.keys(result || {}).length
  };

  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  console.log(`Exported Base44 data to ${filePath}`);
  console.log(`Summary written to ${summaryPath}`);
}

fetchBase44Data().catch((error) => {
  console.error('Base44 export failed:', error);
  process.exit(1);
});
