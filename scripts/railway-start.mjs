import { spawn } from 'node:child_process'
import path from 'node:path'

const service = process.env.RAILWAY_SERVICE_NAME || ''
const isGuide = service.toLowerCase().includes('guide')
const port = process.env.PORT || '3000'

if (isGuide) {
  console.log(`Railway start → Next guide on :${port}`)
  const child = spawn(
    'npx',
    ['next', 'start', '--hostname', '0.0.0.0', '--port', port],
    {
      cwd: path.resolve('assistant'),
      stdio: 'inherit',
      shell: true,
      env: process.env,
    },
  )
  child.on('exit', (code) => process.exit(code ?? 1))
} else {
  console.log(`Railway start → static store on :${port}`)
  const child = spawn('npx', ['serve', 'dist', '-s', '-l', port], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  child.on('exit', (code) => process.exit(code ?? 1))
}
