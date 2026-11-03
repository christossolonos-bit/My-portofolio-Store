import { execSync } from 'node:child_process'

console.log('Railway build → store')
execSync('npm run build:store', { stdio: 'inherit' })
