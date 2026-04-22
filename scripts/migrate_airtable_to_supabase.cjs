// scripts/migrate_airtable_to_supabase.cjs
// One-time migration: copies all Airtable career records into Supabase.
// Usage: AIRTABLE_TOKEN=<pat> SUPABASE_SERVICE_KEY=<key> node scripts/migrate_airtable_to_supabase.cjs

const AIRTABLE_TOKEN     = process.env.AIRTABLE_TOKEN;
const SUPABASE_URL       = 'https://qywesurzzunxdduvyquy.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BASE  = 'app7CzdOBdcdWpqj4';
const TABLE = 'tblIM2gYIKk8Xt6KT';

if (!AIRTABLE_TOKEN || !SUPABASE_SERVICE_KEY) {
  console.error('❌  Set AIRTABLE_TOKEN and SUPABASE_SERVICE_KEY env vars before running.');
  process.exit(1);
}

// ─── Airtable ────────────────────────────────────────────────────────────────

async function fetchAllFromAirtable() {
  const records = [];
  let offset = null;
  let page = 1;

  do {
    const url = new URL(`https://api.airtable.com/v0/${BASE}/${TABLE}`);
    url.searchParams.set('pageSize', '100');
    if (offset) url.searchParams.set('offset', offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
    });
    if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);

    const data = await res.json();
    records.push(...data.records);
    offset = data.offset || null;
    console.log(`  page ${page++} — ${records.length} records fetched so far`);
  } while (offset);

  return records;
}

function mapRecord(r) {
  const f = r.fields;
  return {
    name:                 f.name                 || '',
    primary_industry:     f.primary_industry     || null,
    secondary_industries: f.secondary_industries || null,
    description:          f.description          || null,
    traits:               f.traits               || null,
    keywords:             f.keywords             || null,
    salary_range:         f.salary_range         || null,
    crossover_label:      f.crossover_label      || null,
    source_url:           f.source_url           || null,
    reviewed:             f.reviewed             || false,
    work_style:           f.work_style           || null,
    schedule_type:        f.schedule_type        || null,
    work_environment:     f.work_environment     || null,
    degree_required:      f.degree_required      || null,
    entry_level_friendly: f.entry_level_friendly || null,
    requirements:         f.requirements         || null,
  };
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

async function truncateTable() {
  // Delete all rows before a fresh migration run
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers?name=not.is.null`, {
    method: 'DELETE',
    headers: {
      apikey:        SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      Prefer:        'return=minimal',
    },
  });
  if (!res.ok) throw new Error(`Truncate failed ${res.status}: ${await res.text()}`);
}

async function insertBatch(batch) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/careers`, {
    method: 'POST',
    headers: {
      apikey:          SUPABASE_SERVICE_KEY,
      Authorization:   `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type':  'application/json',
      Prefer:          'return=minimal',
    },
    body: JSON.stringify(batch),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄  Fetching all careers from Airtable...\n');
  const raw = await fetchAllFromAirtable();
  console.log(`\n✅  ${raw.length} records fetched from Airtable`);

  const seen = new Set();
  const records = raw
    .map(mapRecord)
    .filter(r => r.name.trim())
    .filter(r => {
      const key = r.name.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

  console.log('🗑️   Clearing existing Supabase records...');
  await truncateTable();
  console.log('✅  Table cleared\n');

  console.log(`📦  Inserting ${records.length} records into Supabase in batches of 100...\n`);

  let inserted = 0;
  for (let i = 0; i < records.length; i += 100) {
    const batch = records.slice(i, i + 100);
    await insertBatch(batch);
    inserted += batch.length;
    console.log(`  ✓  ${inserted} / ${records.length}`);
  }

  console.log(`\n✅  Migration complete — ${inserted} careers in Supabase.`);
}

main().catch(e => {
  console.error('\n❌ ', e.message);
  process.exit(1);
});
