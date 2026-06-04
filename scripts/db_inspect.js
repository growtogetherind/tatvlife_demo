import pg from 'pg';

const { Client } = pg;

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-southeast-2',
  'ca-central-1',
  'sa-east-1'
];

async function tryRegion(region) {
  const connectionString = `postgresql://postgres.verefgdrbcjmmsqgkdfe:Krishan%409898@aws-0-${region}.pooler.supabase.com:5432/postgres`;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000
  });

  try {
    await client.connect();
    console.log(`\n>>> SUCCESS: Connected to region ${region}!`);
    
    // Test a simple query
    const res = await client.query("SELECT now();");
    console.log("Time from DB:", res.rows[0].now);
    
    await client.end();
    return true;
  } catch (err) {
    if (err.message.includes("tenant/user")) {
      process.stdout.write(`.`);
    } else {
      console.log(`\nRegion ${region} failed with other error:`, err.message);
      if (err.message.includes("password authentication failed")) {
        console.log("Password or user issue, but connected!");
        await client.end();
        return true;
      }
    }
    try {
      await client.end();
    } catch {}
    return false;
  }
}

async function main() {
  console.log("Scanning regions for Supabase pooler on port 5432...");
  for (const region of regions) {
    const success = await tryRegion(region);
    if (success) {
      console.log(`Scan finished: found region ${region}`);
      break;
    }
  }
}

main();
