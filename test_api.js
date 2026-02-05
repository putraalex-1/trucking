#!/usr/bin/env node

/**
 * API Testing Script untuk Truck Inspection System
 * 
 * Jalankan dengan: node test_api.js
 * Pastikan server sudah running di http://localhost:3000
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, API_URL);
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(url, options, (res) => {
            let body = '';
            
            res.on('data', (chunk) => {
                body += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsedBody = body ? JSON.parse(body) : null;
                    resolve({
                        status: res.statusCode,
                        data: parsedBody
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    });
}

async function runTests() {
    log('\n🧪 Starting API Tests...', 'cyan');
    log('='.repeat(50), 'cyan');
    
    let testsPassed = 0;
    let testsFailed = 0;

    // Test 1: Health Check
    log('\n📍 Test 1: Health Check', 'blue');
    try {
        const response = await makeRequest('GET', '/health');
        if (response.status === 200 && response.data.status === 'OK') {
            log('✅ PASSED - Server is healthy', 'green');
            testsPassed++;
        } else {
            log('❌ FAILED - Unexpected response', 'red');
            testsFailed++;
        }
    } catch (error) {
        log(`❌ FAILED - ${error.message}`, 'red');
        testsFailed++;
    }

    // Test 2: Get All Inspections
    log('\n📍 Test 2: Get All Inspections', 'blue');
    try {
        const response = await makeRequest('GET', '/inspections');
        if (response.status === 200 && Array.isArray(response.data)) {
            log(`✅ PASSED - Retrieved ${response.data.length} inspections`, 'green');
            testsPassed++;
        } else {
            log('❌ FAILED - Expected array response', 'red');
            testsFailed++;
        }
    } catch (error) {
        log(`❌ FAILED - ${error.message}`, 'red');
        testsFailed++;
    }

    // Test 3: Create New Inspection
    log('\n📍 Test 3: Create New Inspection', 'blue');
    const testData = {
        tanggal: '2024-02-05',
        waktu: '15:30',
        supplier: 'PT Test Supplier',
        driver: 'Test Driver',
        nomorTruck: 'B 9999 TEST',
        inspector: 'Test Inspector',
        conclusion: 'approved',
        overallNotes: 'Test inspection created by automated test',
        items: {
            1: 'ok',
            2: 'ok',
            3: 'not-ok',
            4: 'ok',
            5: 'na'
        },
        notes: {
            3: 'This is a test note for item 3'
        },
        photos: {}
    };

    let createdId = null;
    try {
        const response = await makeRequest('POST', '/inspections', testData);
        if (response.status === 201 && response.data.id) {
            createdId = response.data.id;
            log(`✅ PASSED - Created inspection with ID: ${createdId}`, 'green');
            testsPassed++;
        } else {
            log('❌ FAILED - Could not create inspection', 'red');
            testsFailed++;
        }
    } catch (error) {
        log(`❌ FAILED - ${error.message}`, 'red');
        testsFailed++;
    }

    // Test 4: Get Specific Inspection
    if (createdId) {
        log('\n📍 Test 4: Get Specific Inspection', 'blue');
        try {
            const response = await makeRequest('GET', `/inspections/${createdId}`);
            if (response.status === 200 && response.data.id === createdId) {
                log(`✅ PASSED - Retrieved inspection ${createdId}`, 'green');
                log(`   Supplier: ${response.data.supplier}`, 'yellow');
                log(`   Truck: ${response.data.nomorTruck}`, 'yellow');
                testsPassed++;
            } else {
                log('❌ FAILED - Could not retrieve inspection', 'red');
                testsFailed++;
            }
        } catch (error) {
            log(`❌ FAILED - ${error.message}`, 'red');
            testsFailed++;
        }
    }

    // Test 5: Update Inspection
    if (createdId) {
        log('\n📍 Test 5: Update Inspection', 'blue');
        const updateData = {
            ...testData,
            conclusion: 'conditional',
            overallNotes: 'Updated by automated test'
        };
        
        try {
            const response = await makeRequest('PUT', `/inspections/${createdId}`, updateData);
            if (response.status === 200) {
                log(`✅ PASSED - Updated inspection ${createdId}`, 'green');
                testsPassed++;
            } else {
                log('❌ FAILED - Could not update inspection', 'red');
                testsFailed++;
            }
        } catch (error) {
            log(`❌ FAILED - ${error.message}`, 'red');
            testsFailed++;
        }
    }

    // Test 6: Get Statistics
    log('\n📍 Test 6: Get Statistics', 'blue');
    try {
        const response = await makeRequest('GET', '/statistics');
        if (response.status === 200 && typeof response.data.total === 'number') {
            log('✅ PASSED - Retrieved statistics', 'green');
            log(`   Total: ${response.data.total}`, 'yellow');
            log(`   Approved: ${response.data.approved}`, 'yellow');
            log(`   Conditional: ${response.data.conditional}`, 'yellow');
            log(`   Rejected: ${response.data.rejected}`, 'yellow');
            testsPassed++;
        } else {
            log('❌ FAILED - Invalid statistics response', 'red');
            testsFailed++;
        }
    } catch (error) {
        log(`❌ FAILED - ${error.message}`, 'red');
        testsFailed++;
    }

    // Test 7: Filter Inspections by Date
    log('\n📍 Test 7: Filter Inspections by Date', 'blue');
    try {
        const response = await makeRequest('GET', '/inspections?startDate=2024-02-01&endDate=2024-02-28');
        if (response.status === 200 && Array.isArray(response.data)) {
            log(`✅ PASSED - Filtered ${response.data.length} inspections`, 'green');
            testsPassed++;
        } else {
            log('❌ FAILED - Filter did not work', 'red');
            testsFailed++;
        }
    } catch (error) {
        log(`❌ FAILED - ${error.message}`, 'red');
        testsFailed++;
    }

    // Test 8: Delete Inspection
    if (createdId) {
        log('\n📍 Test 8: Delete Inspection', 'blue');
        try {
            const response = await makeRequest('DELETE', `/inspections/${createdId}`);
            if (response.status === 200) {
                log(`✅ PASSED - Deleted inspection ${createdId}`, 'green');
                testsPassed++;
            } else {
                log('❌ FAILED - Could not delete inspection', 'red');
                testsFailed++;
            }
        } catch (error) {
            log(`❌ FAILED - ${error.message}`, 'red');
            testsFailed++;
        }
    }

    // Test Summary
    log('\n' + '='.repeat(50), 'cyan');
    log('📊 Test Summary:', 'cyan');
    log(`   ✅ Passed: ${testsPassed}`, 'green');
    log(`   ❌ Failed: ${testsFailed}`, 'red');
    log(`   📈 Success Rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`, 'yellow');
    log('='.repeat(50) + '\n', 'cyan');

    if (testsFailed === 0) {
        log('🎉 All tests passed!', 'green');
        process.exit(0);
    } else {
        log('⚠️  Some tests failed. Please check the logs above.', 'red');
        process.exit(1);
    }
}

// Check if server is running
log('🔍 Checking if server is running...', 'yellow');
makeRequest('GET', '/health')
    .then(() => {
        log('✅ Server is running!', 'green');
        runTests();
    })
    .catch((error) => {
        log('❌ Server is not running!', 'red');
        log('💡 Please start the server first with: npm start', 'yellow');
        process.exit(1);
    });
