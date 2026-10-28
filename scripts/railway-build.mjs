import { execSync } from 'node:child_process'

const service = process.env.RAILWAY_SERVICE_NAME || ''
const isGuide =
  service.toLowerCase().includes('guide') ||
  process.env.RAILWAY_SERVICE_ID === process.env.SOLONARAS_GUIDE_SERVICE_ID

if (isGuide) {
  console.log(`Railway build → assistant (service=${service || 'guide'})`)
  execSync('npm install', { cwd: 'assistant', stdio: 'inherit' })
  execSync('npm run build', { cwd: 'assistant', stdio: 'inherit' })
} else {
  console.log(`Railway build → store (service=${service || 'store'})`)
  execSync('npm run build:store', { stdio: 'inherit' })
}
