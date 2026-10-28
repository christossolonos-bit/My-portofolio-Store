import fs from 'fs'

const html = fs.readFileSync('yt.html', 'utf8')
const ids = [...html.matchAll(/"videoId":"([^"]+)"/g)].map((m) => m[1])
const titles = [...html.matchAll(/"title":\{"runs":\[\{"text":"([^"]+)"/g)].map((m) => m[1])
const channel =
  html.match(/channel_id=([A-Za-z0-9_-]+)/)?.[1] ||
  html.match(/"channelId":"([^"]+)"/)?.[1]

console.log('channel', channel)
console.log('unique ids', [...new Set(ids)].length)
console.log([...new Set(ids)].slice(0, 50).join('\n'))
console.log('---titles---')
console.log(titles.slice(0, 80).join('\n'))
