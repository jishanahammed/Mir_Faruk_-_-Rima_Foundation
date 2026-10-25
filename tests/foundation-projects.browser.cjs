// Run after npm run build. Uses the browser tooling already in this repository.
const { chromium, expect } = require('../.volunteer-work/browser/node_modules/playwright/test');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const requests = [];
  let projects = [{ Id: 7, ProjectCode: 'EXISTING', ProjectCategoryId: 1,
    ProjectTitleEn: 'Existing project', ProjectTitleBn: 'Existing title', Status: 'draft',
    DivisionId: 2, DistrictId: 20, UpazilaId: 200, UnionParishadorPourashavaId: 9, WardId: 8, Images: [] }];
  const locations = {
    divisions: [{ id: 1, nameEn: 'Division one' }, { id: 2, nameEn: 'Division two' }],
    districts: [{ id: 10, divisionId: 1, nameEn: 'District one' }, { id: 20, divisionId: 2, nameEn: 'District two' }],
    upazilas: [{ id: 100, districtId: 10, nameEn: 'Upazila one' }, { id: 200, districtId: 20, nameEn: 'Upazila two' }],
    'local-governments': [{ id: 1, upazilaId: 100, nameEn: 'Default Union' }, { id: 9, upazilaId: 200, nameEn: 'Saved Pourashava' }],
    wards: [
      { Id: 5, LocalGovernmentId: 1, WardNo: 1, NameEn: 'Central', IsActive: true },
      { Id: 8, LocalGovernmentId: 9, WardNo: 2, NameEn: 'North', IsActive: true },
      { Id: 6, LocalGovernmentId: 9, WardNo: 3, NameEn: 'South', IsActive: true },
    ],
  };
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      let text = ''; for await (const chunk of req) text += chunk;
      res.setHeader('content-type', 'application/json');
      if (url.pathname.includes('/FoundationProjects')) {
        assert.equal(req.headers.authorization, 'Bearer project-browser-test');
        const body = text ? JSON.parse(text) : null;
        requests.push({ method: req.method, body });
        if (req.method === 'GET') return res.end(JSON.stringify(projects));
        const project = { ...body, Id: req.method === 'POST' ? 8 : Number(url.pathname.split('/').pop()), Images: [] };
        projects = projects.filter(item => item.Id !== project.Id).concat(project);
        return res.end(JSON.stringify(project));
      }
      if (url.pathname.includes('/ProjectCategories')) return res.end(JSON.stringify([{ id: 1, nameEn: 'Education' }]));
      if (url.pathname.includes('/Locations/')) return res.end(JSON.stringify(locations[url.pathname.split('/').pop()] ?? []));
      res.end(JSON.stringify({ unseen: 0, total: 0, items: [] }));
    } catch (error) { res.statusCode = 500; res.end(JSON.stringify({ message: error.message })); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const apiPort = server.address().port;
  const nextPort = 3117;
  const logPath = path.resolve('build/foundation-project-work/browser-next.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  const log = fs.openSync(logPath, 'w');
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(nextPort)], {
    cwd: process.cwd(), windowsHide: true, stdio: ['ignore', log, log],
    env: { ...process.env, AUTH_API_BASE_URL: `http://127.0.0.1:${apiPort}/api/v1/`, NO_PROXY: 'localhost,127.0.0.1', no_proxy: 'localhost,127.0.0.1' },
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
      { name: 'mir_admin_session', value: 'project-browser-test', domain: 'localhost', path: '/' },
      { name: 'mir_admin_user', value: encodeURIComponent(JSON.stringify({ name: 'Test Admin', role: 'Admin' })), domain: 'localhost', path: '/' },
    ]);
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    const base = `http://localhost:${nextPort}/admin/Foundation_Projects`;

    await page.goto(base + '?add=1');
    await expect(page.getByLabel('Union Parishad / Pourashava', { exact: true })).toHaveValue('1');
    const wardSelect = page.getByRole('combobox', { name: 'Ward', exact: true });
    await expect(wardSelect).toHaveValue('');
    await expect(wardSelect.locator('option')).toHaveText(['Select Ward', 'Ward 1 — Central']);
    await wardSelect.selectOption('5');
    await expect(page.locator('[name=divisionId]')).toHaveValue('1');
    await expect(page.locator('[name=districtId]')).toHaveValue('10');
    await expect(page.locator('[name=upazilaId]')).toHaveValue('100');
    await page.getByLabel('Project Code').fill('NEW');
    await page.locator('[name=projectCategoryId]').selectOption('1');
    await page.locator('[name=projectTitleEn]').fill('New project');
    await page.locator('[name=projectTitleBn]').fill('New title');
    await page.getByRole('button', { name: 'Create Project', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Add New Project' })).toHaveCount(0);
    const created = requests.find(req => req.method === 'POST').body;
    assert.equal(created.UnionParishadorPourashavaId, 1);
    assert.equal(created.WardId, 5);
    assert.equal('Ward' in created, false);
    console.log('PASS: New projects submit numeric union ID 1 and WardId 5 through an authenticated action.');

    await page.goto(base + '?edit=7');
    await expect(page.getByLabel('Union Parishad / Pourashava', { exact: true })).toHaveValue('9');
    await expect(wardSelect).toHaveValue('8');
    await expect(wardSelect.locator('option')).toHaveText(['Select Ward', 'Ward 2 — North', 'Ward 3 — South']);
    await expect(page.locator('[name=divisionId]')).toHaveValue('2');
    await expect(page.locator('[name=districtId]')).toHaveValue('20');
    await expect(page.locator('[name=upazilaId]')).toHaveValue('200');
    await wardSelect.selectOption('6');
    await page.getByRole('button', { name: 'Update Project', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Edit Project', exact: true })).toHaveCount(0);
    const updated = requests.find(req => req.method === 'PUT').body;
    assert.equal(updated.UnionParishadorPourashavaId, 9);
    assert.equal(updated.WardId, 6);
    assert.equal('Ward' in updated, false);
    assert.equal(updated.DistrictId, 20); assert.equal(updated.UpazilaId, 200);
    console.log('PASS: PascalCase responses populate edit fields; saving preserves the location and submits numeric WardId.');

    await page.goto(base + '?view=7');
    await expect(page.getByText('Saved Pourashava', { exact: true })).toBeVisible();
    await expect(page.getByText('Ward', { exact: true })).toBeVisible();
    await expect(page.getByText('Ward 3 — South', { exact: true })).toBeVisible();

    await page.goto(base + '?edit=7');
    await expect(wardSelect).toHaveValue('6');
    // Changing any parent must discard the old ward before saving.
    await page.locator('[name=unionParishadorPourashavaId]').selectOption('');
    await expect(wardSelect).toHaveValue('');
    await expect(wardSelect).toBeDisabled();
    await page.locator('[name=unionParishadorPourashavaId]').selectOption('9');
    await wardSelect.selectOption('8');
    await page.locator('[name=upazilaId]').selectOption('');
    await expect(wardSelect).toHaveValue('');
    await expect(wardSelect).toBeDisabled();
    await page.locator('[name=unionParishadorPourashavaId]').selectOption('9');
    await wardSelect.selectOption('8');
    await page.locator('[name=districtId]').selectOption('');
    await expect(wardSelect).toHaveValue('');
    await expect(wardSelect).toBeDisabled();
    await page.locator('[name=unionParishadorPourashavaId]').selectOption('9');
    await wardSelect.selectOption('8');
    await page.locator('[name=divisionId]').selectOption('1');
    await expect(page.locator('[name=districtId]')).toHaveValue('');
    await expect(page.locator('[name=upazilaId]')).toHaveValue('');
    await expect(page.getByLabel('Union Parishad / Pourashava', { exact: true })).toHaveValue('');
    await expect(wardSelect).toHaveValue('');
    await expect(wardSelect).toBeDisabled();
    await page.getByRole('button', { name: 'Update Project', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Edit Project', exact: true })).toHaveCount(0);
    const cleared = requests.filter(req => req.method === 'PUT').at(-1).body;
    assert.equal(cleared.UnionParishadorPourashavaId, null); assert.equal(cleared.WardId, null);
    assert.equal(cleared.DistrictId, null); assert.equal(cleared.UpazilaId, null);
    console.log('PASS: View shows saved location; changing a parent clears child selections and nullable values stay null.');
    assert.deepEqual(errors, []);
  } finally {
    await browser?.close();
    next.kill();
    await new Promise(resolve => server.close(resolve));
    fs.closeSync(log);
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
