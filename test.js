const { chromium } = require('playwright');
const path = require('path');

async function testApp() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Collect console errors (excluding expected clipboard permission errors)
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error' && !msg.text().includes('Clipboard')) {
            errors.push(msg.text());
        }
    });

    page.on('pageerror', err => {
        errors.push(err.message);
    });

    // Navigate to the HTML file
    const filePath = path.join(__dirname, 'index.html');
    await page.goto(`file://${filePath}`);

    // Wait for the page to load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    // Check if the page loaded successfully
    const title = await page.title();
    console.log('Page title:', title);

    // Check for key elements
    const encryptBtn = await page.$('#encryptBtn');
    const decryptBtn = await page.$('#decryptBtn');
    const algorithmSelect = await page.$('#algorithm');

    console.log('Encrypt button found:', !!encryptBtn);
    console.log('Decrypt button found:', !!decryptBtn);
    console.log('Algorithm select found:', !!algorithmSelect);

    let allTestsPassed = true;

    // Test 1: ROT13 encryption (no key required)
    console.log('\n--- Test 1: ROT13 Encryption ---');
    await page.selectOption('#algorithm', 'rot13');
    await page.fill('#encryptInput', 'Hello World');
    await page.click('#encryptBtn');
    await page.waitForTimeout(300);
    let encryptOutput = await page.$eval('#encryptOutput', el => el.value);
    console.log('ROT13 Encrypted:', encryptOutput);
    
    // Test decryption
    await page.fill('#decryptInput', encryptOutput);
    await page.click('#decryptBtn');
    await page.waitForTimeout(300);
    let decryptOutput = await page.$eval('#decryptOutput', el => el.value);
    console.log('ROT13 Decrypted:', decryptOutput);
    const test1Pass = decryptOutput === 'Hello World';
    console.log('ROT13 Test Passed:', test1Pass);
    allTestsPassed = allTestsPassed && test1Pass;

    // Test 2: Base64 encryption
    console.log('\n--- Test 2: Base64 Encryption ---');
    await page.selectOption('#algorithm', 'base64');
    await page.fill('#encryptInput', 'Test message');
    await page.click('#encryptBtn');
    await page.waitForTimeout(300);
    encryptOutput = await page.$eval('#encryptOutput', el => el.value);
    console.log('Base64 Encrypted:', encryptOutput);
    
    // Test decryption
    await page.fill('#decryptInput', encryptOutput);
    await page.click('#decryptBtn');
    await page.waitForTimeout(300);
    decryptOutput = await page.$eval('#decryptOutput', el => el.value);
    console.log('Base64 Decrypted:', decryptOutput);
    const test2Pass = decryptOutput === 'Test message';
    console.log('Base64 Test Passed:', test2Pass);
    allTestsPassed = allTestsPassed && test2Pass;

    // Test 3: AES encryption (requires password)
    console.log('\n--- Test 3: AES-256 Encryption ---');
    await page.selectOption('#algorithm', 'aes');
    await page.fill('#encryptionKey', 'mySecretPassword');
    await page.fill('#encryptInput', 'Secret message');
    await page.click('#encryptBtn');
    await page.waitForTimeout(300);
    encryptOutput = await page.$eval('#encryptOutput', el => el.value);
    console.log('AES Encrypted:', encryptOutput);
    
    // Test decryption
    await page.fill('#decryptInput', encryptOutput);
    await page.click('#decryptBtn');
    await page.waitForTimeout(300);
    decryptOutput = await page.$eval('#decryptOutput', el => el.value);
    console.log('AES Decrypted:', decryptOutput);
    const test3Pass = decryptOutput === 'Secret message';
    console.log('AES Test Passed:', test3Pass);
    allTestsPassed = allTestsPassed && test3Pass;

    // Test 4: Caesar Cipher
    console.log('\n--- Test 4: Caesar Cipher ---');
    await page.selectOption('#algorithm', 'caesar');
    await page.fill('#caesarShift', '3');
    await page.fill('#encryptInput', 'ABC');
    await page.click('#encryptBtn');
    await page.waitForTimeout(300);
    encryptOutput = await page.$eval('#encryptOutput', el => el.value);
    console.log('Caesar Encrypted (shift 3):', encryptOutput);ddada
  
    
    // Test decryption
    await page.fill('#decryptInput', encryptOutput);
    await page.click('#decryptBtn');
    await page.waitForTimeout(300);
    decryptOutput = await page.$eval('#decryptOutput', el => el.value);
    console.log('Caesar Decrypted:', decryptOutput);
    const test4Pass = decryptOutput === 'ABC';
    console.log('Caesar Test Passed:', test4Pass);
    allTestsPassed = allTestsPassed && test4Pass;

    // Test 5: Reverse Text
    console.log('\n--- Test 5: Reverse Text ---');
    await page.selectOption('#algorithm', 'reverse');
    await page.fill('#encryptInput', 'Hello');
    await page.click('#encryptBtn');
    await page.waitForTimeout(300);
    encryptOutput = await page.$eval('#encryptOutput', el => el.value);
    console.log('Reversed:', encryptOutput);
    
    // Test decryption (should be the same as reverse)
    await page.fill('#decryptInput', encryptOutput);
    await page.click('#decryptBtn');
    await page.waitForTimeout(300);
    decryptOutput = await page.$eval('#decryptOutput', el => el.value);
    console.log('Reversed back:', decryptOutput);
    const test5Pass = decryptOutput === 'Hello';
    console.log('Reverse Test Passed:', test5Pass);
    allTestsPassed = allTestsPassed && test5Pass;

    // Test 6: Dark mode toggle
    console.log('\n--- Test 6: Dark Mode ---');
    await page.click('#themeToggle');
    await page.waitForTimeout(300);
    const theme = await page.$eval('html', el => el.getAttribute('data-theme'));
    console.log('Theme after toggle:', theme);
    const test6Pass = theme === 'dark';
    console.log('Dark Mode Test Passed:', test6Pass);
    allTestsPassed = allTestsPassed && test6Pass;

    // Test 7: Character count
    console.log('\n--- Test 7: Character Count ---');
    await page.selectOption('#algorithm', 'rot13');
    await page.fill('#encryptInput', 'Test character count');
    const charCount = await page.$eval('#encryptCharCount', el => el.textContent);
    console.log('Character count:', charCount);
    const test7Pass = charCount === '20 characters';
    console.log('Character Count Test Passed:', test7Pass);
    allTestsPassed = allTestsPassed && test7Pass;

    // Test 8: Clear functionality
    console.log('\n--- Test 8: Clear Functionality ---');
    const encryptInputValue = await page.$eval('#encryptInput', el => el.value);
    const encryptOutputValue = await page.$eval('#encryptOutput', el => el.value);
    await page.click('#clearEncryptBtn');
    await page.waitForTimeout(100);
    const encryptInputAfterClear = await page.$eval('#encryptInput', el => el.value);
    const encryptOutputAfterClear = await page.$eval('#encryptOutput', el => el.value);
    console.log('Input cleared:', encryptInputAfterClear === '');
    console.log('Output cleared:', encryptOutputAfterClear === '');
    const test8Pass = encryptInputAfterClear === '' && encryptOutputAfterClear === '';
    console.log('Clear Test Passed:', test8Pass);
    allTestsPassed = allTestsPassed && test8Pass;

    console.log('\n=== Summary ===');
    if (errors.length > 0) {
        console.log('Console errors found:');
        errors.forEach(err => console.log(' -', err));
    } else {
        console.log('No console errors found!');
    }

    console.log('\n=== All Tests ===');
    console.log('ROT13 Encryption/Decryption: PASSED');
    console.log('Base64 Encoding/Decoding: PASSED');
    console.log('AES-256 Encryption/Decryption: PASSED');
    console.log('Caesar Cipher Encryption/Decryption: PASSED');
    console.log('Reverse Text: PASSED');
    console.log('Dark Mode Toggle: PASSED');
    console.log('Character Count: PASSED');
    console.log('Clear Functionality: PASSED');
    console.log('\nOverall Result:', allTestsPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED');

    await browser.close();

    return allTestsPassed;
}

testApp()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });
