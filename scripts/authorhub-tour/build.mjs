import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import puppeteer from 'puppeteer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const outDir = path.join(__dirname)
const framesDir = path.join(outDir, 'frames')
const audioDir = path.join(outDir, 'audio')
const clipsDir = path.join(outDir, 'clips')
const script = JSON.parse(fs.readFileSync(path.join(outDir, 'script.json'), 'utf8'))
const htmlPath = path.join(outDir, 'tour.html')
const finalOut = path.join(root, 'public', 'videos', 'authorhub.mp4')

for (const dir of [framesDir, audioDir, clipsDir]) {
  fs.mkdirSync(dir, { recursive: true })
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    child.stderr.on('data', (d) => {
      err += d.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} ${args.join(' ')}\n${err.slice(-1200)}`))
    })
  })
}

function ffprobeDuration(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
      { stdio: ['ignore', 'pipe', 'pipe'] },
    )
    let out = ''
    child.stdout.on('data', (d) => {
      out += d.toString()
    })
    child.on('close', (code) => {
      if (code !== 0) reject(new Error('ffprobe failed'))
      else resolve(Math.max(1, Number(out.trim()) || 1))
    })
  })
}

async function makeNarration(i, text) {
  const mp3 = path.join(audioDir, `scene-${i}.mp3`)
  await run('edge-tts', [
    '--voice',
    'en-US-AndrewNeural',
    '--rate',
    '+2%',
    '--text',
    text,
    '--write-media',
    mp3,
  ])
  return mp3
}

async function captureFrames() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
    args: ['--allow-file-access-from-files'],
  })
  const page = await browser.newPage()
  for (const step of script) {
    const url = `${pathToFileURL(htmlPath).href}?scene=${step.scene}`
    await page.goto(url, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 250))
    const frame = path.join(framesDir, `scene-${step.scene}.png`)
    await page.screenshot({ path: frame, type: 'png' })
    console.log('frame', step.scene)
  }
  await browser.close()
}

async function makeClips() {
  const listPath = path.join(outDir, 'concat.txt')
  const lines = []

  for (const step of script) {
    const i = step.scene
    console.log('audio', i)
    const mp3 = await makeNarration(i, step.narration)
    const duration = await ffprobeDuration(mp3)
    const hold = Math.max(duration + 0.45, step.duration)
    const frame = path.join(framesDir, `scene-${i}.png`)
    const clip = path.join(clipsDir, `scene-${i}.mp4`)

    await run('ffmpeg', [
      '-y',
      '-loop',
      '1',
      '-i',
      frame,
      '-i',
      mp3,
      '-vf',
      'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p,fade=t=in:st=0:d=0.35,fade=t=out:st=' +
        Math.max(0.2, hold - 0.4).toFixed(2) +
        ':d=0.35',
      '-c:v',
      'libx264',
      '-preset',
      'medium',
      '-crf',
      '18',
      '-r',
      '30',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-t',
      String(hold.toFixed(2)),
      '-shortest',
      clip,
    ])
    lines.push(`file '${clip.replace(/\\/g, '/')}'`)
    console.log('clip', i, hold.toFixed(2), 's')
  }

  fs.writeFileSync(listPath, lines.join('\n'))
  fs.mkdirSync(path.dirname(finalOut), { recursive: true })
  await run('ffmpeg', [
    '-y',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    listPath,
    '-c',
    'copy',
    finalOut,
  ])
  console.log('wrote', finalOut)
}

await captureFrames()
await makeClips()
