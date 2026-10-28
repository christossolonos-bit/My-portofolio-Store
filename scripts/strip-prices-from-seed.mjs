import fs from 'node:fs'

const p = 'assistant/scripts/seed-solonaras.mjs'
let s = fs.readFileSync(p, 'utf8')

s = s.replace(/Starting at €[\d,.]+\.?/g, '')
s = s.replace(/\. Starting price €[\d,.]+/g, '.')
s = s.replace(/\. Starting price \$\{price\}\./g, '.')
s = s.replace(/ from €[\d,.]+/gi, '')
s = s.replace(/€[\d,.]+ starts /gi, 'The base prototype starts as ')
s = s.replace(/What’s in the €[\d,.]+ /g, 'What’s in the ')
s = s.replace(/What’s included in the Luna Agent €[\d,.]+ starting price\?/g, 'What’s included in the Luna Agent starting scope?')
s = s.replace(/What’s extra beyond the €[\d,.]+ website starting price\?/g, 'What’s extra beyond a starter website?')
s = s.replace(/What’s included at €[\d,.]+\?/g, 'What’s included in a starter website?')
s = s.replace(/€900 includes /g, 'A starter website includes ')
s = s.replace(/Common extras beyond €[\d,.]+\?/g, 'Common extras beyond a starter website?')
s = s.replace(/What is not included at €[\d,.]+\?/g, 'What is not included in the character agent pack?')

s = s.replace(
  /faq\(\s*'faq-prices',\s*'How much do projects cost \/ starting prices\?',\s*'[^']*',\s*\[[^\]]*\]\s*,\s*\)/,
  `faq(
    'faq-prices',
    'How much do projects cost / starting prices / rates?',
    'This portfolio does not list rates. It is a showcase of Christos’s capabilities for recruiting and collaboration. Reach out via the contact form or Discord to talk about roles, freelance scope, or working together.',
    ['pricing', 'hire', 'recruit'],
  )`,
)

s = s.replace(
  /faq\(\s*'faq-pay',\s*'How do I pay \/ book a project\?',\s*'[^']*',\s*\[[^\]]*\]\s*,\s*\)/,
  `faq(
    'faq-pay',
    'How do I hire / book / work with Christos?',
    'Use the contact form at the end of the portfolio or Discord. Say whether you are recruiting, collaborating, or scoping a custom build — he will reply and agree next steps from there. This site is not a self-checkout storefront.',
    ['hire', 'recruit', 'contact'],
  )`,
)

s = s.replace(
  /'Ask about any project, starting prices, what’s included, timelines, customization, demos, or how to hire Christos\. Type or use the mic\.'/,
  `'Ask about any project, what’s included, timelines, customization, demos, or how to contact Christos for recruiting or collaboration. Type or use the mic.'`,
)

s = s.replace(
  /'Best first step for serious buyers: the contact form/,
  `'Best first step for recruiters and collaborators: the contact form`,
)

s = s.replace(
  /'No\. This is Solonaras Store — Christos’s AI portfolio\. It is not YGIA Natural Health and has no herbalist phone line\.'/,
  `'No. This is Solonaras — Christos’s AI portfolio. It is not YGIA Natural Health and has no herbalist phone line.'`,
)

s = s.replace(
  /\['Luna Agent 5\.0', '€4,500', 'full conversational AI companion prototype — mostly local, customization extra', 'luna-agent'\],\s*\['Luna Gaida', '€1,800', 'live voice for Discord, websites, and PC apps — Edge local or Fish API', 'luna-gaida'\],\s*\['Luna Minecraft', '€2,200', 'game agent through Minecraft 1\.21\.1 with persistent learning — private servers first', 'luna-minecraft'\],\s*\['Luna Streamer', '€2,800', 'broadcast companion with chat replies; can run long sessions including 48-hour tests', 'luna-streamer'\],\s*\['Luna Vision Co-host', '€3,200', 'configurable screen-aware co-host — League, Minecraft, and beyond games', 'luna-vision'\],\s*\['DJ Agent', '€2,000', 'track selection \(live mix optional\) from local files or YouTube — clubs and streams', 'dj-agent'\],\s*\['Desktop Companion', '€1,500', 'Windows companion with chat, avatar, and task access — private mode available', 'fluffy'\],\s*\['Singing Avatar SDK', '€1,600', 'singing avatar toolkit with lip-sync included for virtual environments you create', 'singing-sdk'\],\s*\['Multi-persona Companions', '€3,500', 'multiple characters with separate plus shared memory — you provide avatars', 'lunariko'\],\s*\['Character Agents', '€1,400', 'personalized character agents for Discord, stream, web, or desktop movement', 'choko'\],\s*\['AuthorHub', '€2,400', 'author workspace for any book — editing not rewriting, with Kindle and print exports', 'book-editor'\],\s*\['Custom Websites', '€900', 'pages and design on your domain — about three days for starter scope', 'client-work'\],\s*\]\.map\(\(\[name, price, desc, tag\], i\) =>\s*faq\(\s*\`faq-about-\$\{i\}\`,\s*\`Tell me about \$\{name\}\`,\s*\`\$\{name\} is \$\{desc\}\. Starting price \$\{price\}\. Click the aisle video for a tour, or ask a follow-up\. Builds are still concept\/early — use the form or Discord for a live call\.\`,\s*\['project', tag\],\s*\),\s*\)/,
  `[
    ['Luna Agent 5.0', 'full conversational AI companion prototype — mostly local, customization extra', 'luna-agent'],
    ['Luna Gaida', 'live voice for Discord, websites, and PC apps — Edge local or Fish API', 'luna-gaida'],
    ['Luna Minecraft', 'game agent through Minecraft 1.21.1 with persistent learning — private servers first', 'luna-minecraft'],
    ['Luna Streamer', 'broadcast companion with chat replies; can run long sessions including 48-hour tests', 'luna-streamer'],
    ['Luna Vision Co-host', 'configurable screen-aware co-host — League, Minecraft, and beyond games', 'luna-vision'],
    ['DJ Agent', 'track selection (live mix optional) from local files or YouTube — clubs and streams', 'dj-agent'],
    ['Desktop Companion', 'Windows companion with chat, avatar, and task access — private mode available', 'fluffy'],
    ['Singing Avatar SDK', 'singing avatar toolkit with lip-sync included for virtual environments you create', 'singing-sdk'],
    ['Multi-persona Companions', 'multiple characters with separate plus shared memory — you provide avatars', 'lunariko'],
    ['Character Agents', 'personalized character agents for Discord, stream, web, or desktop movement', 'choko'],
    ['AuthorHub', 'author workspace for any book — editing not rewriting, with Kindle and print exports', 'book-editor'],
    ['Custom Websites', 'pages and design on your domain — about three days for starter scope', 'client-work'],
  ].map(([name, desc, tag], i) =>
    faq(
      \`faq-about-\${i}\`,
      \`Tell me about \${name}\`,
      \`\${name} is \${desc}. Click the tour video, or ask a follow-up. Builds are still concept/early — use the form or Discord to talk about recruiting or collaboration.\`,
      ['project', tag],
    ),
  )`,
)

s = s.replace(
  /title: 'Solonaras Store',\s*description: 'Portfolio store of AI companions and custom builds by Christos Solonos \(Cyprus, remote\)\.',\s*keywords: \['solonaras', 'portfolio', 'luna', 'ai', 'prices', 'contact'\],/,
  `title: 'Solonaras',
    description: 'Portfolio of AI companions and custom builds by Christos Solonos (Cyprus, remote) — for recruiting and collaboration.',
    keywords: ['solonaras', 'portfolio', 'luna', 'ai', 'recruit', 'contact'],`,
)

s = s.replace(
  /welcomeMessage:\s*"Hi — I'm the Solonaras guide\. Ask about projects, prices, what’s included, or how to hire Christos\."/,
  `welcomeMessage:
      "Hi — I'm the Solonaras guide. Ask about projects, what’s included, or how to contact Christos for recruiting or collaboration."`,
)

// Clean double spaces / leftover awkward punctuation
s = s.replace(/  +\./g, '.')
s = s.replace(/\.  +/g, '. ')
s = s.replace(/Heavy customization is extra\. \./g, 'Heavy customization is quoted separately.')

fs.writeFileSync(p, s)
const euros = (s.match(/€/g) || []).length
console.log('Remaining € count:', euros)
console.log('Updated', p)
