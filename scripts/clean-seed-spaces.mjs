import fs from 'node:fs'

const p = 'assistant/scripts/seed-solonaras.mjs'
let s = fs.readFileSync(p, 'utf8')
s = s.replace(/\. ',/g, ".',")
s = s.replace(/\.  +/g, '. ')
fs.writeFileSync(p, s)
console.log('euro left', (s.match(/€/g) || []).length)
