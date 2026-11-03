import { spawn } from 'node:child_process'

const port = process.env.PORT || '3000'
console.log(`Railway start → static store on :${port}`)
const child = spawn('npx', ['serve', 'dist', '-s', '-l', port], {
  stdio: 'inherit',
  shell: true,
  env: process.env,
})
child.on('exit', (code) => process.exit(code ?? 1))
