const { chromium } = require('./browser/node_modules/playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    let submissions = [];
    let failSubmission = true;
    await page.route('**/api/locations/**', async route => {
      const url = new URL(route.request().url());
      const endpoint = url.pathname.split('/').pop();
      const items = {
        divisions: [{ id: 1, nameEn: 'Dhaka', nameBn: 'ঢাকা' }, { id: 2, nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' }],
        districts: [{ id: 3, nameEn: 'Test District', nameBn: 'পরীক্ষা জেলা' }],
        upazilas: [{ id: 4, nameEn: 'Test Upazila', nameBn: 'পরীক্ষা উপজেলা' }],
        'local-governments': [{ id: 5, nameEn: 'Test Union', nameBn: 'পরীক্ষা ইউনিয়ন' }],
        wards: [{ id: 6, nameEn: 'Ward 1', nameBn: 'ওয়ার্ড ১' }],
      };
      await route.fulfill({ json: items[endpoint] });
    });
    await page.route('**/api/volunteers/register', async route => {
      submissions.push(route.request().postDataJSON());
      await route.fulfill({ status: failSubmission ? 409 : 201,
        json: failSubmission ? { message: 'A volunteer registration already exists with this phone number or email.' } : { id: 123 } });
    });
    await page.goto('http://localhost:3100/register/volunteer');
    await page.getByRole('heading', { name: 'Become a volunteer' }).waitFor();
    assert(await page.getByRole('button', { name: 'Submit registration' }).isDisabled());
    assert(await page.locator('select[name=districtId]').isDisabled());
    await page.locator('input[name=name]').fill('Volunteer Test');
    await page.locator('input[name=phone]').fill('01712345678');
    await page.getByLabel('Email address', { exact: false }).first().fill('volunteer@example.invalid');
    await page.locator('input[name=profession]').fill('Teacher');
    for (const [name, value] of [['divisionId', '1'], ['districtId', '3'], ['upazilaId', '4'], ['localGovernmentId', '5'], ['wardId', '6']]) {
      await page.locator(`select[name=${name}] option[value="${value}"]`).waitFor({ state: 'attached' });
      await page.locator(`select[name=${name}]`).selectOption(value);
    }
    await page.getByRole('button', { name: 'Submit registration' }).click();
    await page.getByRole('alert').filter({ hasText: 'already exists' }).waitFor();
    assert.equal(await page.locator('input[name=name]').inputValue(), 'Volunteer Test');
    assert(!('isApprove' in submissions[0]) && !('isActive' in submissions[0]));
    assert.equal(submissions[0].wardId, 6);
    console.log('PASS: Cascading locations, pending-submit state, duplicate error and preserved input');
    await page.locator('select[name=divisionId]').selectOption('2');
    for (const name of ['districtId', 'upazilaId', 'localGovernmentId', 'wardId']) assert.equal(await page.locator(`select[name=${name}]`).inputValue(), '');
    assert(await page.getByRole('button', { name: 'Submit registration' }).isDisabled());
    for (const [name, value] of [['districtId', '3'], ['upazilaId', '4'], ['localGovernmentId', '5'], ['wardId', '6']]) {
      await page.locator(`select[name=${name}] option[value="${value}"]`).waitFor({ state: 'attached' });
      await page.locator(`select[name=${name}]`).selectOption(value);
    }
    failSubmission = false;
    await page.getByRole('button', { name: 'Submit registration' }).click();
    await page.getByRole('heading', { name: 'Thank you for volunteering!' }).waitFor();
    console.log('PASS: Changing division clears dependent locations; successful submission shows confirmation');
    await page.getByRole('button', { name: 'Register another volunteer' }).click();
    assert.equal(await page.locator('input[name=name]').inputValue(), '');
    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await page.screenshot({ path: '.volunteer-work/volunteer-mobile.png', fullPage: true });
    await page.evaluate(() => localStorage.setItem('mirfoundation-locale', 'BN'));
    await page.reload();
    await page.getByRole('heading', { name: 'স্বেচ্ছাসেবক হিসেবে যোগ দিন' }).waitFor();
    console.log('PASS: Mobile layout fits viewport and Bangla translation loads');
    await page.evaluate(() => localStorage.setItem('mirfoundation-locale', 'DK'));
    await page.reload();
    await page.getByRole('heading', { name: 'Bliv frivillig' }).waitFor();
    console.log('PASS: Danish translation loads');
    assert.deepEqual(errors, []);
    console.log('PASS: No browser runtime errors');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
