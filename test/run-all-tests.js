const { execSync } = require('child_process')
const path = require('path')

const testFiles = [
  'test_monthly_plan.test.js',
  'test_pause_state.test.js',
  'test_dashboard_stats.test.js',
  'test-llm.js'
]

console.log('==============================================')
console.log('  RUNNING DOMPETJUJUR UNIT TEST SUITE (FOLDER test)')
console.log('==============================================\n')

let passed = 0
let failed = 0

for (const file of testFiles) {
  const filePath = path.join(__dirname, file)
  console.log(`▶ Running test: ${file}...`)
  try {
    const output = execSync(`node --test "${filePath}"`, { encoding: 'utf-8' })
    console.log(output)
    console.log(`✅ PASS: ${file}\n`)
    passed++
  } catch (err) {
    console.error(`❌ FAIL: ${file}`)
    console.error(err.stdout || err.message)
    failed++
  }
}

console.log('==============================================')
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`)
console.log('==============================================')

if (failed > 0) {
  process.exit(1)
}
