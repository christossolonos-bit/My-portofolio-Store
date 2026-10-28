import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import puppeteer from 'puppeteer'
import { renderSceneHtml } from './render-scene.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'tours.json'), 'utf8'))
const only = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const selected = only.length ? tours.filter((t) => only.includes(t.id)) : tours

const thumbsRoot = path.join(__dirname, 'thumbs')
const workRoot = path.join(__dirname, 'work')
const outVideos = path.join(root, 'public', 'videos')

fs.mkdirSync(thumbsRoot, { recursive: true })
fs.mkdirSync(workRoot, { recursive: true })
fs.mkdirSync(outVideos, { recursive: true })

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] })
    let err = ''
    child.stderr.on('data', (d) => {
      err += d.toString()
    })
    child.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${cmd} failed\n${err.slice(-1500)}`))
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
      if (code !== 0) reject(new Error(`ffprobe failed for ${file}`))
      else resolve(Math.max(1, Number(out.trim()) || 1))
    })
  })
}

async function downloadThumb(youtubeId) {
  const dest = path.join(thumbsRoot, `${youtubeId}.jpg`)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) return dest

  const urls = [
    `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    `https://i.ytimg.com/vi/${youtubeId}/mqdefault.jpg`,
  ]

  for (const url of urls) {
    try {
      await run('curl.exe', ['-fsSL', url, '-o', dest])
      if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) return dest
    } catch {
      // try next
    }
  }
  throw new Error(`Could not download thumb for ${youtubeId}`)
}

async function prepareThumbs(tour) {
  const files = []
  for (const id of tour.youtubeIds || []) {
    files.push(await downloadThumb(id))
  }
  return files
}

async function makeNarration(mp3, text) {
  let lastError
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
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
      return
    } catch (error) {
      lastError = error
      await new Promise((r) => setTimeout(r, 1200 * attempt))
    }
  }
  throw lastError
}

async function buildTour(tour, browser) {
  console.log(`\n=== ${tour.id} ===`)
  const tourDir = path.join(workRoot, tour.id)
  const framesDir = path.join(tourDir, 'frames')
  const audioDir = path.join(tourDir, 'audio')
  const clipsDir = path.join(tourDir, 'clips')
  const htmlDir = path.join(tourDir, 'html')
  for (const dir of [framesDir, audioDir, clipsDir, htmlDir]) fs.mkdirSync(dir, { recursive: true })

  const thumbs = await prepareThumbs(tour)
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 })

  const concatLines = []

  for (let i = 0; i < tour.scenes.length; i++) {
    const scene = tour.scenes[i]
    const html = renderSceneHtml(tour, scene, i, thumbs)
    const htmlPath = path.join(htmlDir, `scene-${i}.html`)
    fs.writeFileSync(htmlPath, html)

    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
    await new Promise((r) => setTimeout(r, 200))
    const frame = path.join(framesDir, `scene-${i}.png`)
    await page.screenshot({ path: frame, type: 'png' })

    const mp3 = path.join(audioDir, `scene-${i}.mp3`)
    await makeNarration(mp3, scene.narration)
    const duration = await ffprobeDuration(mp3)
    const hold = Math.max(duration + 0.4, 5.5)
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
      `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,format=yuv420p,fade=t=in:st=0:d=0.3,fade=t=out:st=${Math.max(0.2, hold - 0.35).toFixed(2)}:d=0.3`,
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '20',
      '-r',
      '30',
      '-c:a',
      'aac',
      '-b:a',
      '160k',
      '-t',
      hold.toFixed(2),
      '-shortest',
      clip,
    ])

    concatLines.push(`file '${clip.replace(/\\/g, '/')}'`)
    console.log(`  scene ${i + 1}/${tour.scenes.length} (${hold.toFixed(1)}s)`)
  }

  await page.close()

  const listPath = path.join(tourDir, 'concat.txt')
  fs.writeFileSync(listPath, concatLines.join('\n'))

  const outMp4 = path.join(outVideos, `${tour.id}-tour.mp4`)
  const outPoster = path.join(outVideos, `${tour.id}-poster.png`)
  await run('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outMp4])
  fs.copyFileSync(path.join(framesDir, 'scene-0.png'), outPoster)
  console.log(`  wrote ${path.basename(outMp4)}`)
  return outMp4
}

const browser = await puppeteer.launch({
  headless: true,
  args: ['--allow-file-access-from-files'],
})

try {
  for (const tour of selected) {
    await buildTour(tour, browser)
  }
} finally {
  await browser.close()
}

console.log('\nAll requested tours complete.')
