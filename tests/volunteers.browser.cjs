// Run after npm run build. API calls use an isolated mock server.
const { chromium, expect: baseExpect } = require('../.volunteer-work/browser/node_modules/playwright/test');
const http = require('node:http');
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const expect = baseExpect.configure({ timeout: 20000 });

(async () => {
  let items = [];
  const writes = [];
  const calls = [];
  const baseItem = { divisionId: 1, division: 'Dhaka', districtId: 2, district: 'Dhaka',
    upazilaId: 3, upazila: 'Savar', localGovernmentId: 4, localGovernment: 'Test Union',
    wardId: 5, ward: 'Ward 1', isApprove: false, isActive: true, isLeader: false, userId: null };
  let profile = { ...baseItem, id: 101, name: 'Portal Leader', phone: '01712345678', email: 'leader@example.invalid', profession: 'Teacher', userId: 'leader-user', isLeader: true, createdAt: '2026-10-23T20:00:00' };
  const directory = Array.from({ length: 23 }, (_, index) => ({ ...baseItem, id: index + 200,
    name: `Volunteer ${index + 1}`, phone: '01812345678', email: `volunteer${index + 1}@example.invalid`,
    profession: index > 20 ? 'Nurse' : 'Teacher', isApprove: index < 10, isActive: index < 15 || index >= 20 }));
  directory.push({ ...baseItem, id: 300, name: 'Outside Ward Volunteer', phone: '01912345678',
    email: 'outside@example.invalid', profession: 'Nurse', wardId: 6, localGovernmentId: 7, localGovernment: 'Other Union', isApprove: true });
  const profileWrites = [];
  const passwordWrites = [];
  let failProfileSave = true;
  let failLeaderSave = true;
  let failDirectory = false;
  const server = http.createServer(async (req, res) => {
    try {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const body = raw ? JSON.parse(raw) : null;
      const url = new URL(req.url, 'http://localhost');
      calls.push(`${req.method} ${url.pathname} ${items.length ? JSON.stringify(items.map(({ id, isLeader, isApprove }) => ({ id, isLeader, isApprove }))) : '[]'}`);
      res.setHeader('content-type', 'application/json');
      if (url.pathname.includes('/VolunteerPortal/')) {
        assert.equal(req.headers.authorization, 'Bearer volunteer-login-test');
        if (url.pathname.endsWith('/me')) {
          if (req.method === 'PUT') {
            profileWrites.push(body);
            if (failProfileSave) { failProfileSave = false; res.statusCode = 409; return res.end(JSON.stringify({ message: 'That email is already registered.' })); }
            profile = { ...profile, ...body };
          }
          return res.end(JSON.stringify(profile));
        }
        if (failDirectory) { res.statusCode = 503; return res.end(JSON.stringify({ message: 'Volunteer information is temporarily unavailable.' })); }
        const search = (url.searchParams.get('search') || '').toLowerCase();
        let rows = directory.filter(item => item.wardId === profile.wardId
          && (!search || `${item.name} ${item.profession}`.toLowerCase().includes(search)));
        if (url.searchParams.has('isActive')) rows = rows.filter(item => String(item.isActive) === url.searchParams.get('isActive'));
        if (url.searchParams.has('isApprove')) rows = rows.filter(item => String(item.isApprove) === url.searchParams.get('isApprove'));
        const pageSize = Number(url.searchParams.get('pageSize')) || 20; const page = Math.min(Math.max(1, Number(url.searchParams.get('page')) || 1), Math.max(1, Math.ceil(rows.length / pageSize)));
        return res.end(JSON.stringify({ items: rows.slice((page - 1) * pageSize, page * pageSize), total: rows.length, page, pageSize }));
      }
      if (url.pathname.includes('/Auth/forgot-password')) {
        passwordWrites.push({ kind: 'request', body });
        return res.end(JSON.stringify({ message: 'A verification code has been sent.' }));
      }
      if (url.pathname.includes('/Auth/reset-password')) {
        passwordWrites.push({ kind: 'reset', body });
        if (body.Otp !== '123456') { res.statusCode = 400; return res.end(JSON.stringify({ message: 'Invalid or expired verification code.' })); }
        return res.end(JSON.stringify({ message: 'Your password has been reset successfully.' }));
      }
      if (url.pathname.includes('/Auth/login') || url.pathname.includes('/Auth/refreshtoken')) {
        return res.end(JSON.stringify({ accessToken: 'volunteer-login-test', refreshToken: 'volunteer-refresh',
          accessTokenExpiry: new Date(Date.now() + 1800000).toISOString(),
          user: { userId: 'leader-user', fullName: 'Portal Leader', email: 'leader@example.invalid', roleName: 'Volunteer', roleNames: ['Volunteer'] } }));
      }
      if (url.pathname.endsWith('/Volunteers/register')) {
        writes.push({ method: 'PUBLIC', body }); res.statusCode = 201;
        return res.end(JSON.stringify({ id: 900 }));
      }
      if (url.pathname.includes('/Volunteers')) {
        assert.equal(req.headers.authorization, 'Bearer volunteer-browser-test');
        if (req.method === 'GET') return res.end(JSON.stringify({ items, total: items.length, page: 1, pageSize: 20 }));
        writes.push({ method: req.method, body });
        const id = Number(url.pathname.split('/').filter(Boolean).findLast(part => /^\d+$/.test(part)));
        if (req.method === 'POST') {
          const { password, ...details } = body;
          const item = { ...baseItem, ...details, plainPassword: body.isLeader ? password || `Generated-mock-${items.length + 1}-729!` : null, id: items.length + 1, userId: body.isLeader ? `leader-user-${items.length + 1}` : null };
          items.push(item); res.statusCode = 201; return res.end(JSON.stringify(item));
        }
        if (req.method === 'PUT') {
          const { password, ...details } = body;
          const item = items.find(item => item.id === id);
          if (url.pathname.endsWith('/leader') && body.isLeader && failLeaderSave) {
            failLeaderSave = false; res.statusCode = 503;
            return res.end(JSON.stringify({ message: 'Unable to assign leader. Please try again.' }));
          }
          Object.assign(item, details);
          if (password) item.plainPassword = password;
          if (item.isLeader && !item.userId) {
            item.userId = `leader-user-${id}`;
            item.plainPassword = password || `Generated-mock-${id}-729!`;
          }
          return res.end(JSON.stringify(item));
        }
        if (req.method === 'DELETE') { items = items.filter(item => item.id !== id); res.statusCode = 204; return res.end(); }
      }
      res.end(JSON.stringify({ unseen: 0, total: 0, items: [] }));
    } catch (error) { res.statusCode = 500; res.end(JSON.stringify({ message: error.message })); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = 3128;
  fs.mkdirSync('build/volunteer-leader-work', { recursive: true });
  const log = fs.openSync('build/volunteer-leader-work/browser-next.log', 'w');
  const next = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], {
    windowsHide: true, stdio: ['ignore', log, log],
    env: { ...process.env, AUTH_API_BASE_URL: `http://127.0.0.1:${server.address().port}/api/v1/`, NO_PROXY: 'localhost,127.0.0.1', no_proxy: 'localhost,127.0.0.1' },
  });
  let browser;
  const origin = `http://localhost:${port}`;
  const errors = [];
  try {
    let ready = false;
    for (let i = 0; i < 60; i++) {
      try { await fetch(origin + '/login'); ready = true; break; }
      catch { await new Promise(resolve => setTimeout(resolve, 250)); }
    }
    assert(ready, 'Next.js failed to start');
    browser = await chromium.launch({ headless: true });
    const admin = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await admin.addCookies([
      { name: 'mir_admin_session', value: 'volunteer-browser-test', domain: 'localhost', path: '/' },
      { name: 'mir_admin_user', value: encodeURIComponent(JSON.stringify({ name: 'Test Admin', role: 'Admin' })), domain: 'localhost', path: '/' },
    ]);
    const page = await admin.newPage(); page.on('pageerror', error => errors.push(error.message));
    await page.route('**/api/locations/**', route => {
      const endpoint = new URL(route.request().url()).pathname.split('/').pop();
      const values = { divisions: [1, 'Dhaka'], districts: [2, 'Dhaka'], upazilas: [3, 'Savar'], 'local-governments': [4, 'Test Union'], wards: [5, 'Ward 1'] };
      return route.fulfill({ json: [{ id: values[endpoint][0], nameEn: values[endpoint][1] }] });
    });
    await page.goto(origin + '/admin/volunteers');
    await page.getByRole('button', { name: 'Add volunteer', exact: true }).click();
    await page.getByLabel('Full name').fill('Leader Test');
    await page.getByLabel('Mobile number').fill('01712345678');
    await page.getByLabel('Email address', { exact: false }).first().fill('leader@example.invalid');
    await page.getByLabel('Profession').fill('Teacher');
    for (const [name, value] of [['divisionId', '1'], ['districtId', '2'], ['upazilaId', '3'], ['localGovernmentId', '4'], ['wardId', '5']]) {
      await expect(page.locator(`select[name=${name}]`)).toBeEnabled();
      await page.locator(`select[name=${name}]`).selectOption(value);
    }
    await page.getByRole('checkbox', { name: /Volunteer leader/ }).check();
    await expect(page.getByLabel('Initial password')).toHaveJSProperty('required', false);
    await page.getByLabel('Initial password').fill('Leader-test-729!');
    await page.getByRole('button', { name: 'Add volunteer', exact: true }).last().click();
    await expect(page.getByRole('status').filter({ hasText: 'Volunteer added successfully.' })).toBeVisible();
    assert.equal(writes[0].body.isLeader, true); assert.equal(writes[0].body.password, 'Leader-test-729!');
    await expect(page.getByRole('cell', { name: /Login account linked/ })).toBeVisible();
    await page.getByRole('button', { name: 'Show password for Leader Test', exact: true }).click();
    await expect(page.getByRole('table').getByText('Leader-test-729!', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Hide password for Leader Test', exact: true }).click();
    console.log('PASS: Admin adds a leader with complete location and initial password; list shows the linked account.');

    await page.getByRole('button', { name: 'Add volunteer', exact: true }).click();
    await page.getByLabel('Full name').fill('Another Leader');
    await page.getByLabel('Mobile number').fill('01812345678');
    await page.getByLabel('Email address', { exact: false }).first().fill('another-leader@example.invalid');
    await page.getByLabel('Profession').fill('Nurse');
    for (const [name, value] of [['divisionId', '1'], ['districtId', '2'], ['upazilaId', '3'], ['localGovernmentId', '4'], ['wardId', '5']]) {
      await expect(page.locator(`select[name=${name}]`)).toBeEnabled();
      await page.locator(`select[name=${name}]`).selectOption(value);
    }
    await expect(page.getByText('A ward can have multiple volunteer leaders. Each leader has a separate login account.', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Add volunteer', exact: true }).last().click();
    await expect(page.getByRole('status').filter({ hasText: 'Volunteer added successfully.' })).toBeVisible();
    const anotherRow = page.getByRole('row').filter({ has: page.getByText('Another Leader', { exact: true }) });
    const writesBeforePromotion = writes.length;
    await anotherRow.getByRole('button', { name: 'Make leader', exact: true }).click();
    const leaderForm = anotherRow.getByRole('form', { name: 'Make Another Leader a leader', exact: true });
    await expect(leaderForm.getByLabel('Leader password', { exact: true })).toBeFocused();
    assert.equal(writes.length, writesBeforePromotion);
    assert.equal(items[1].isLeader, false);
    await leaderForm.getByRole('button', { name: 'Confirm leader', exact: true }).click();
    assert.equal(writes.length, writesBeforePromotion);
    await leaderForm.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(leaderForm).toHaveCount(0);
    assert.equal(items[1].isLeader, false);
    await anotherRow.getByRole('button', { name: 'Make leader', exact: true }).click();
    await leaderForm.getByLabel('Leader password', { exact: true }).fill('Chosen-leader-729!');
    await leaderForm.getByRole('button', { name: 'Show leader password', exact: true }).click();
    await expect(leaderForm.getByLabel('Leader password', { exact: true })).toHaveAttribute('type', 'text');
    await leaderForm.getByRole('button', { name: 'Hide leader password', exact: true }).click();
    await expect(leaderForm.getByLabel('Leader password', { exact: true })).toHaveAttribute('type', 'password');
    await page.screenshot({ path: 'build/volunteer-leader-work/leader-password-form.png', fullPage: true });
    await leaderForm.getByRole('button', { name: 'Confirm leader', exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Unable to assign leader. Please try again.' })).toBeVisible();
    await expect(leaderForm.getByLabel('Leader password', { exact: true })).toHaveValue('Chosen-leader-729!');
    assert.equal(items[1].isLeader, false);
    await leaderForm.getByRole('button', { name: 'Confirm leader', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Volunteer is now a leader.' })).toBeVisible();
    await expect(leaderForm).toHaveCount(0);
    assert.deepEqual(writes.at(-1).body, { isLeader: true, password: 'Chosen-leader-729!' });
    await expect(page.getByRole('heading', { name: /Edit volunteer:/ })).toHaveCount(0);
    await expect(page.getByRole('cell', { name: /Login account linked/ })).toHaveCount(2);
    assert.equal(items.length, 2);
    assert(items.every(item => item.isLeader && item.wardId === 5));
    assert.notEqual(items[0].userId, items[1].userId);
    assert.equal(items[1].plainPassword, 'Chosen-leader-729!');
    await anotherRow.getByRole('button', { name: 'Show password for Another Leader', exact: true }).click();
    await expect(anotherRow.getByText('Chosen-leader-729!', { exact: true })).toBeVisible();
    await anotherRow.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Profession').fill('Doctor');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(anotherRow.getByText('Doctor', { exact: true })).toBeVisible();
    assert.equal(items[0].isLeader, true);
    assert.equal(items[1].isLeader, true);
    await anotherRow.getByRole('button', { name: 'Remove leader', exact: true }).click();
    await expect(anotherRow.getByText('Portal access removed', { exact: true })).toBeVisible();
    assert.equal(items[0].isLeader, true);
    await anotherRow.getByRole('button', { name: 'Make leader', exact: true }).click();
    await leaderForm.getByLabel('Leader password', { exact: true }).fill('Reassigned-leader-729!');
    await leaderForm.getByRole('button', { name: 'Confirm leader', exact: true }).click();
    await expect(anotherRow.getByText('Login account linked', { exact: true })).toBeVisible();
    assert.equal(items[1].plainPassword, 'Reassigned-leader-729!');
    await anotherRow.getByRole('button', { name: 'Delete', exact: true }).click();
    await anotherRow.getByRole('button', { name: 'Confirm delete', exact: true }).click();
    await expect(anotherRow).toHaveCount(0);
    await expect(page.getByRole('cell', { name: /Login account linked/ })).toHaveCount(1);
    console.log('PASS: Make leader asks for a password, supports cancel and retry, and saves the chosen password for new and existing accounts without affecting the other leader.');

    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await expect(page.getByLabel('Initial password')).toHaveCount(0);
    await expect(page.getByLabel('Assigned password', { exact: true })).toHaveValue('Leader-test-729!');
    await expect(page.getByLabel('Assigned password', { exact: true })).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: 'Show assigned password', exact: true }).click();
    await expect(page.getByLabel('Assigned password', { exact: true })).toHaveAttribute('type', 'text');
    await page.getByLabel('Assigned password', { exact: true }).fill('Leader-updated-729!');
    await page.getByLabel('Profession').fill('Engineer');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Volunteer details updated.' })).toBeVisible();
    const edit = writes.filter(write => write.method === 'PUT').at(-1).body;
    assert.equal(edit.isLeader, true); assert.equal(edit.profession, 'Engineer'); assert.equal(edit.password, 'Leader-updated-729!');
    assert.equal(items[0].plainPassword, 'Leader-updated-729!');
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByLabel('Assigned password', { exact: true }).fill('');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Edit volunteer: Leader Test', exact: true })).toHaveCount(0);
    assert.equal(items[0].plainPassword, 'Leader-updated-729!');
    assert(!('password' in writes.filter(write => write.method === 'PUT').at(-1).body));
    await page.getByRole('button', { name: 'Approve', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Remove approval' })).toBeVisible();
    await page.getByRole('button', { name: 'Deactivate', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Activate', exact: true })).toBeVisible();
    assert.equal(items[0].isApprove, true); assert.equal(items[0].isActive, false);
    await page.getByRole('button', { name: 'Edit', exact: true }).click();
    await page.getByRole('checkbox', { name: /Volunteer leader/ }).uncheck();
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(page.getByRole('cell', { name: /Portal access removed/ })).toBeVisible();
    console.log('PASS: Admin passwords can be shown, prefilled and updated; blank edits preserve them. Approval, active status and demotion still work.');

    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Cancel', exact: true }).click(); assert.equal(items.length, 1);
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await page.getByRole('button', { name: 'Confirm delete', exact: true }).click();
    await expect(page.getByRole('cell', { name: /No volunteers found/ })).toBeVisible();
    console.log('PASS: Delete requires confirmation and refreshes the empty list.');

    const publicResponse = await page.request.post(origin + '/api/volunteers/register', { data: { name: 'Public', isLeader: true, password: 'ignored' } });
    assert.equal(publicResponse.status(), 201);
    const publicWrite = writes.find(write => write.method === 'PUBLIC');
    assert(!('isLeader' in publicWrite.body) && !('password' in publicWrite.body));
    await page.goto(origin + '/register/volunteer');
    await expect(page.getByRole('checkbox', { name: /Volunteer leader/ })).toHaveCount(0);
    const registration = page.locator('form').filter({ has: page.locator('input[name=profession]') });
    await registration.locator('[name=name]').fill('Public Volunteer');
    await registration.locator('[name=phone]').fill('01812345678');
    await registration.locator('[name=email]').fill('public@example.invalid');
    await registration.locator('[name=profession]').fill('Teacher');
    for (const [name, value] of [['divisionId', '1'], ['districtId', '2'], ['upazilaId', '3'], ['localGovernmentId', '4'], ['wardId', '5']]) {
      await expect(registration.locator(`select[name=${name}]`)).toBeEnabled();
      await registration.locator(`select[name=${name}]`).selectOption(value);
    }
    await registration.getByRole('button', { name: 'Submit registration', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Thank you for volunteering!' })).toBeVisible();
    const submittedPublic = writes.filter(write => write.method === 'PUBLIC').at(-1).body;
    assert.equal(submittedPublic.name, 'Public Volunteer');
    assert(!('isLeader' in submittedPublic) && !('password' in submittedPublic));
    console.log('PASS: Public registration still submits successfully and cannot send leader privileges or passwords.');

    const visitor = await browser.newContext();
    const portal = await visitor.newPage(); portal.on('pageerror', error => errors.push(error.message));
    await portal.route('**/api/locations/**', route => {
      const endpoint = new URL(route.request().url()).pathname.split('/').pop();
      const values = { divisions: [1, 'Dhaka'], districts: [2, 'Dhaka'], upazilas: [3, 'Savar'], 'local-governments': [4, 'Test Union'], wards: [5, 'Ward 1'] };
      return route.fulfill({ json: [{ id: values[endpoint][0], nameEn: values[endpoint][1] }] });
    });
    await portal.goto(origin + '/volunteer'); await expect(portal).toHaveURL(/\/login\?next=/);
    await portal.locator('#email').fill('leader@example.invalid');
    await portal.locator('#password').fill('Leader-test-729!');
    await portal.getByRole('button', { name: 'Login', exact: true }).click();
    await expect(portal).toHaveURL(origin + '/volunteer');
    await expect(portal.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible();
    const dashboard = portal.getByRole('region', { name: 'Volunteer dashboard', exact: true });
    await expect(dashboard.getByRole('heading', { name: 'Welcome back, Portal Leader.', exact: true })).toBeVisible();
    await expect(dashboard.getByLabel('Your assigned Ward').getByText('Ward 1', { exact: true })).toBeVisible();
    await expect(dashboard.getByLabel('Your assigned Ward').getByText('Test Union, Savar, Dhaka, Dhaka', { exact: true })).toBeVisible();
    const statistics = dashboard.getByRole('region', { name: 'Volunteer statistics', exact: true });
    for (const [label, count] of [['Total volunteers', '23'], ['Active volunteers', '18'], ['Approved volunteers', '10'], ['Pending approval', '13']]) {
      await expect(statistics.locator('dl > div').filter({ has: portal.getByText(label, { exact: true }) }).locator('dd > p').first()).toHaveText(count);
    }
    const recent = dashboard.getByRole('region', { name: 'Recent volunteers', exact: true });
    await expect(recent.getByRole('listitem')).toHaveCount(5);
    await expect(recent.getByText('Volunteer 1', { exact: true })).toBeVisible();
    const snapshot = dashboard.getByRole('region', { name: 'Your volunteer information', exact: true });
    await expect(snapshot.getByText('24 Oct 2026', { exact: true })).toBeVisible();
    await expect(snapshot.getByText('Active account', { exact: true })).toBeVisible();
    await expect(snapshot.getByText('Profile pending approval', { exact: true })).toBeVisible();
    await expect(snapshot.getByText(/^Test Union, Savar, Dhaka, Dhaka/)).toBeVisible();
    await expect(dashboard.getByRole('link', { name: 'Change my password', exact: true })).toHaveAttribute('href', '/volunteer/change-password');
    await expect(dashboard.getByText('Outside Ward Volunteer', { exact: true })).toHaveCount(0);
    console.log('PASS: Dashboard shows assigned Ward, Ward-only totals and recent registrations, profile and account status.');
    failDirectory = true;
    await portal.reload();
    await expect(portal.getByRole('alert').filter({ hasText: 'Some dashboard information could not be loaded.' })).toBeVisible();
    await expect(statistics.getByText('—', { exact: true })).toHaveCount(4);
    await expect(snapshot.getByText('Teacher', { exact: true })).toBeVisible();
    failDirectory = false;
    await portal.reload();
    await expect(statistics.locator('dl > div').first().locator('dd > p').first()).toHaveText('23');
    console.log('PASS: Dashboard keeps available profile details and shows unavailable counts instead of zero when summary requests fail.');
    const navigation = portal.getByRole('navigation', { name: 'Volunteer navigation' });
    await expect(navigation.getByRole('link')).toHaveCount(5);
    await expect(navigation.getByRole('link', { name: 'Dashboard', exact: true })).toHaveAttribute('aria-current', 'page');
    await expect(portal.getByRole('complementary', { name: 'Volunteer sidebar' })).toBeVisible();
    await portal.screenshot({ path: 'build/volunteer-leader-work/volunteer-dashboard-desktop.png', fullPage: true });
    await portal.goto(origin + '/admin/volunteers'); await expect(portal).toHaveURL(origin + '/volunteer');
    await portal.goto(origin + '/doner'); await expect(portal).toHaveURL(origin + '/volunteer');

    await navigation.getByRole('link', { name: 'Volunteer List', exact: true }).click();
    await expect(portal.getByRole('heading', { name: 'Volunteer List', exact: true })).toBeVisible();
    await expect(portal.getByRole('heading', { name: 'Volunteers in your Ward', exact: true })).toBeVisible();
    await expect(portal.getByLabel('Your assigned Ward').getByText('Test Union, Savar, Dhaka, Dhaka', { exact: true })).toBeVisible();
    await expect(portal.getByText('23 volunteers found', { exact: true })).toBeVisible();
    await expect(portal.getByRole('table').locator('tbody tr')).toHaveCount(20);
    await expect(portal.getByRole('button', { name: /^(Edit|Delete|Approve)$/ })).toHaveCount(0);
    await portal.getByRole('link', { name: 'Next', exact: true }).click();
    await expect(portal.getByText('Page 2 of 2', { exact: true })).toBeVisible();
    await expect(portal.getByRole('table').locator('tbody tr')).toHaveCount(3);
    await portal.getByRole('textbox', { name: 'Search volunteers' }).fill('Nurse');
    await portal.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(portal.getByText('2 volunteers found', { exact: true })).toBeVisible();
    await expect(portal.getByRole('table').locator('tbody tr')).toHaveCount(2);
    await portal.getByRole('combobox', { name: 'Active status' }).selectOption('false');
    await portal.getByRole('button', { name: 'Search', exact: true }).click();
    await expect(portal.getByRole('cell', { name: /No volunteers found/ })).toBeVisible();
    await portal.goto(origin + '/volunteer/volunteers?search=Outside&wardId=6');
    await expect(portal.getByText('0 volunteers found', { exact: true })).toBeVisible();
    await expect(portal.getByText('Outside Ward Volunteer', { exact: true })).toHaveCount(0);
    console.log('PASS: Volunteer directory keeps search, pagination and active filtering inside the assigned Ward and ignores a supplied Ward ID.');

    await navigation.getByRole('link', { name: 'My Profile', exact: true }).click();
    await expect(portal.getByRole('heading', { name: 'My Profile', exact: true })).toBeVisible();
    await expect(portal.getByLabel('Full name')).toHaveValue('Portal Leader');
    await expect(portal.getByRole('checkbox', { name: /Volunteer leader/ })).toHaveCount(0);
    await expect(portal.getByLabel('Assigned password', { exact: true })).toHaveCount(0);
    await portal.getByLabel('Full name').fill('Updated Portal Leader');
    await portal.getByLabel('Email address', { exact: false }).first().fill('updated@example.invalid');
    await portal.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(portal.getByRole('alert').filter({ hasText: 'That email is already registered.' })).toBeVisible();
    await expect(portal.getByLabel('Full name')).toHaveValue('Updated Portal Leader');
    await portal.getByRole('button', { name: 'Save changes', exact: true }).click();
    await expect(portal.getByRole('status').filter({ hasText: 'Your volunteer profile has been updated.' })).toBeVisible();
    assert.equal(profile.name, 'Updated Portal Leader');
    assert(!('userId' in profileWrites.at(-1)) && !('isLeader' in profileWrites.at(-1)) && !('password' in profileWrites.at(-1)));
    const profileCookie = (await visitor.cookies()).find(cookie => cookie.name === 'mir_admin_user');
    assert.equal(JSON.parse(decodeURIComponent(decodeURIComponent(profileCookie.value))).name, 'Updated Portal Leader');
    assert.equal(await portal.evaluate(() => JSON.parse(localStorage.getItem('mir_admin_user')).email), 'updated@example.invalid');
    console.log('PASS: My Profile saves only personal details, preserves failed input and synchronizes the current session.');

    await navigation.getByRole('link', { name: 'Change Password', exact: true }).click();
    await expect(portal.getByRole('heading', { name: 'Change Password', exact: true })).toBeVisible();
    await portal.getByRole('button', { name: 'Send verification code', exact: true }).click();
    await portal.getByLabel('Verification Code', { exact: true }).fill('000000');
    await portal.getByLabel('New Password', { exact: true }).fill('New-password-729!');
    await portal.getByLabel('Confirm New Password', { exact: true }).fill('Different-729!');
    await portal.getByRole('button', { name: 'Update password', exact: true }).click();
    await expect(portal.getByText('Password and confirm password do not match.', { exact: true })).toBeVisible();
    assert.equal(passwordWrites.filter(write => write.kind === 'reset').length, 0);
    await portal.getByLabel('Confirm New Password', { exact: true }).fill('New-password-729!');
    await portal.getByRole('button', { name: 'Update password', exact: true }).click();
    await expect(portal.getByText('Invalid or expired verification code.', { exact: true })).toBeVisible();
    await portal.getByLabel('Verification Code', { exact: true }).fill('123456');
    await portal.getByRole('button', { name: 'Update password', exact: true }).click();
    await expect(portal.getByText('Password updated', { exact: true })).toBeVisible();
    assert.equal(passwordWrites[0].body.Email, 'updated@example.invalid');
    assert.equal(passwordWrites.at(-1).body.NewPassword, 'New-password-729!');
    console.log('PASS: Change Password uses the current profile email and handles password mismatch, invalid codes and success.');

    await navigation.getByRole('link', { name: 'Dashboard', exact: true }).click();
    await portal.setViewportSize({ width: 390, height: 844 });
    await expect(dashboard.getByRole('heading', { name: 'Welcome back, Updated Portal Leader.', exact: true })).toBeVisible();
    assert(await portal.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await portal.screenshot({ path: 'build/volunteer-leader-work/volunteer-dashboard-mobile-overview.png', fullPage: true });
    await expect(portal.getByRole('complementary', { name: 'Volunteer sidebar' })).toBeHidden();
    await portal.getByRole('button', { name: 'Open volunteer menu', exact: true }).click();
    await expect(portal.getByRole('dialog', { name: 'Volunteer menu', exact: true })).toBeVisible();
    await expect(navigation.getByRole('link')).toHaveCount(5);
    await portal.screenshot({ path: 'build/volunteer-leader-work/volunteer-dashboard-mobile-menu.png', fullPage: true });
    await portal.keyboard.press('Escape');
    await expect(portal.getByRole('dialog', { name: 'Volunteer menu', exact: true })).toBeHidden();
    await expect(portal.getByRole('button', { name: 'Open volunteer menu', exact: true })).toBeFocused();
    await portal.getByRole('button', { name: 'Open volunteer menu', exact: true }).click();
    await navigation.getByRole('link', { name: 'Volunteer List', exact: true }).click();
    await expect(portal.getByRole('heading', { name: 'Volunteer List', exact: true })).toBeVisible();
    await expect(portal.getByRole('dialog', { name: 'Volunteer menu', exact: true })).toBeHidden();
    assert(await portal.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await portal.screenshot({ path: 'build/volunteer-leader-work/volunteer-dashboard-mobile.png', fullPage: true });
    await portal.getByRole('button', { name: 'Logout', exact: true }).click();
    await expect(portal).toHaveURL(origin + '/login');
    assert(!(await visitor.cookies()).some(cookie => cookie.name === 'mir_admin_session'));
    console.log('PASS: Volunteer dashboard and mobile navigation remain responsive; logout and admin/donor route restrictions still work.');
    assert.deepEqual(errors, []);
    const authModule = await import('data:text/javascript;base64,' + fs.readFileSync('src/lib/admin-auth.js').toString('base64'));
    assert.equal(authModule.getUserHomePath({ role: 'Admin' }), '/admin');
    assert.equal(authModule.getUserHomePath({ role: 'Donor' }), '/doner');
    assert.equal(authModule.getUserHomePath({ role: 'Volunteer' }), '/volunteer');
    console.log('PASS: Admin and donor home routing stays unchanged; no browser runtime errors.');
  } catch (error) {
    console.error('Browser errors:', errors);
    console.error('API call trace:', calls.join('\n'));
    throw error;
  } finally {
    await browser?.close(); next.kill(); fs.closeSync(log);
    await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
