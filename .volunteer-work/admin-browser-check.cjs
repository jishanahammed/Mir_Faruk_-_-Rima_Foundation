const { chromium } = require('./browser/node_modules/playwright');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  let item = { id: 1, name: 'Volunteer Review Test', phone: '01712345678', email: 'review@example.invalid', profession: 'Teacher',
    divisionId: 1, division: 'Dhaka', districtId: 2, district: 'Dhaka', upazilaId: 3, upazila: 'Savar',
    localGovernmentId: 4, localGovernment: 'Test Union', wardId: 5, ward: 'Ward 1', isApprove: false, isActive: true,
    createdAt: '2026-09-29T12:00:00Z' };
  const requests = [];
  const server = http.createServer(async (req, res) => {
    let body = ''; for await (const chunk of req) body += chunk;
    const url = new URL(req.url, 'http://localhost:5199');
    res.setHeader('content-type', 'application/json');
    if (url.pathname.includes('/Volunteers')) {
      assert.equal(req.headers.authorization, 'Bearer volunteer-browser-test');
      requests.push({ method: req.method, path: url.pathname, body: body ? JSON.parse(body) : null });
      if (req.method === 'PUT') Object.assign(item, JSON.parse(body));
      if (req.method === 'DELETE') { item = null; res.statusCode = 204; return res.end(); }
      if (req.method === 'GET') return res.end(JSON.stringify({ items: item ? [item] : [], total: item ? 1 : 0, page: 1, pageSize: 20 }));
      return res.end(JSON.stringify(item));
    }
    res.end(JSON.stringify({ unseen: 0, total: 0, items: [] }));
  });
  await new Promise(resolve => server.listen(5199, '127.0.0.1', resolve));
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3101'], {
    cwd: process.cwd(), env: { ...process.env, AUTH_API_BASE_URL: 'http://127.0.0.1:5199/api/v1/' }, stdio: 'ignore', windowsHide: true,
  });
  let browser;
  try {
    for (let i = 0; i < 50; i++) { try { await fetch('http://localhost:3101/login'); break; } catch { await sleep(200); } }
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addCookies([
      { name: 'mir_admin_session', value: 'volunteer-browser-test', domain: 'localhost', path: '/' },
      { name: 'mir_admin_user', value: encodeURIComponent(JSON.stringify({ name: 'Test Admin', role: 'Admin' })), domain: 'localhost', path: '/' },
    ]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/locations/**', route => {
      const endpoint = new URL(route.request().url()).pathname.split('/').pop();
      const values = { divisions: [1, 'Dhaka'], districts: [2, 'Dhaka'], upazilas: [3, 'Savar'], 'local-governments': [4, 'Test Union'], wards: [5, 'Ward 1'] };
      return route.fulfill({ json: [{ id: values[endpoint][0], nameEn: values[endpoint][1] }] });
    });
    await page.goto('http://localhost:3101/admin/volunteers');
    await page.getByRole('cell', { name: /Volunteer Review Test/ }).waitFor();
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Volunteer approved.' }).waitFor();
    await page.getByRole('button', { name: 'Remove approval' }).waitFor();
    assert.equal(item.isApprove, true);
    await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
    await page.getByRole('button', { name: 'Activate', exact: true }).waitFor();
    assert.equal(item.isActive, false); assert.equal(item.isApprove, true);
    console.log('PASS: Admin approval and active toggles call authenticated server actions and refresh the list');
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Profession').fill('Engineer');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await page.getByRole('status').filter({ hasText: 'Volunteer details updated.' }).waitFor();
    assert.equal(item.profession, 'Engineer');
    console.log('PASS: Admin edit retains locations and updates volunteer details');
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    assert(item);
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert(item);
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm delete' }).click();
    await page.getByRole('cell', { name: /No volunteers found/ }).waitFor();
    assert.equal(item, null);
    assert.deepEqual(errors, []);
    console.log('PASS: Delete confirmation/cancellation and empty state; no browser runtime errors');
  } finally {
    await browser?.close(); next.kill(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
