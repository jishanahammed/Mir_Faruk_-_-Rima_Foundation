// Run after npm run build. Uses the existing local browser tooling and a mock API.
const { chromium, expect } = require('../.volunteer-work/browser/node_modules/playwright/test');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const requests = [];
  let assistances = [{ Id: 7, ProjectId: 1, ProjectTitleEn: 'Education project',
    NameEn: 'Existing assistance', NameBn: 'Existing title', DonationCode: 'DN-00007',
    TargetBeneficiaryType: 'Family', SupportMode: 'Cash', TargetAmount: 1000, IsActive: true }];
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      let raw = ''; for await (const chunk of req) raw += chunk;
      res.setHeader('content-type', 'application/json');
      if (url.pathname.includes('/AssistanceTypes')) {
        throw new Error('The assistance page must not request assistance types.');
      }
      if (url.pathname.includes('/FoundationProjects')) {
        return res.end(JSON.stringify([{ Id: 1, ProjectTitleEn: 'Education project' }]));
      }
      if (url.pathname.includes('/ProjectAssistances')) {
        assert.equal(req.headers.authorization, 'Bearer assistance-browser-test');
        const body = raw ? JSON.parse(raw) : null;
        requests.push({ method: req.method, body });
        if (req.method === 'GET') return res.end(JSON.stringify(assistances));
        assert.equal(Object.hasOwn(body, 'AssistanceTypeId'), false);
        const id = req.method === 'POST' ? 8 : Number(url.pathname.split('/').pop());
        const assistance = { ...body, Id: id, ProjectTitleEn: 'Education project',
          DonationCode: `DN-${String(id).padStart(5, '0')}` };
        assistances = assistances.filter(item => item.Id !== id).concat(assistance);
        return res.end(JSON.stringify(assistance));
      }
      res.end(JSON.stringify({ unseen: 0, total: 0, items: [] }));
    } catch (error) { res.statusCode = 500; res.end(JSON.stringify({ message: error.message })); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const nextPort = 3118;
  const logPath = path.resolve('build/project-assistance-work/browser-next.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const log = fs.openSync(logPath, 'w');
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(nextPort)], {
    windowsHide: true, stdio: ['ignore', log, log],
    env: { ...process.env, AUTH_API_BASE_URL: `http://127.0.0.1:${server.address().port}/api/v1/`,
      NO_PROXY: 'localhost,127.0.0.1', no_proxy: 'localhost,127.0.0.1' },
  });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { await fetch(`http://localhost:${nextPort}/login`); ready = true; break; }
      catch { await new Promise(resolve => setTimeout(resolve, 250)); }
    }
    assert(ready, `Next.js did not start. See ${logPath}`);
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addCookies([
      { name: 'mir_admin_session', value: 'assistance-browser-test', domain: 'localhost', path: '/' },
      { name: 'mir_admin_user', value: encodeURIComponent(JSON.stringify({ name: 'Test Admin', role: 'Admin' })), domain: 'localhost', path: '/' },
    ]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const base = `http://localhost:${nextPort}/admin/project-assistance`;
    await page.goto(base + '?add=1');
    await expect(page.getByRole('heading', { name: 'Add New Assistance' })).toBeVisible();
    await expect(page.locator('[name=assistanceTypeId]')).toHaveCount(0);
    await expect(page.getByRole('columnheader', { name: 'Type', exact: true })).toHaveCount(0);
    await page.locator('[name=projectId]').selectOption('1');
    await page.locator('[name=nameEn]').fill('School supplies');
    await page.locator('[name=nameBn]').fill('School supplies title');
    await page.locator('[name=targetAmount]').fill('2000');
    await page.getByRole('button', { name: 'Create Assistance', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Add New Assistance' })).toHaveCount(0);
    const created = requests.find(req => req.method === 'POST').body;
    assert.equal(created.ProjectId, 1);
    assert.equal(created.NameEn, 'School supplies');
    assert.equal(created.TargetAmount, 2000);
    assert.equal(Object.hasOwn(created, 'AssistanceTypeId'), false);
    console.log('PASS: New assistance can be created without selecting or submitting AssistanceTypeId.');

    await page.goto(base + '?edit=7');
    await expect(page.locator('[name=projectId]')).toHaveValue('1');
    await expect(page.locator('[name=assistanceTypeId]')).toHaveCount(0);
    await page.locator('[name=nameEn]').fill('Updated assistance');
    await page.getByRole('button', { name: 'Update Assistance', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Edit Assistance', exact: true })).toHaveCount(0);
    const updated = requests.find(req => req.method === 'PUT').body;
    assert.equal(updated.ProjectId, 1);
    assert.equal(updated.NameEn, 'Updated assistance');
    assert.equal(updated.TargetBeneficiaryType, 'Family');
    assert.equal(updated.TargetAmount, 1000);
    assert.equal(Object.hasOwn(updated, 'AssistanceTypeId'), false);
    await expect(page.getByText('DN-00007', { exact: true })).toBeVisible();
    assert.deepEqual(errors, []);
    console.log('PASS: Editing preserves project, beneficiary, funding and donation code without AssistanceTypeId.');
  } finally {
    await browser?.close();
    next.kill();
    await new Promise(resolve => server.close(resolve));
    fs.closeSync(log);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
