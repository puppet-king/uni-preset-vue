const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')

process.env.NO_PROXY = '127.0.0.1,localhost'
delete process.env.HTTP_PROXY
delete process.env.HTTPS_PROXY
delete process.env.http_proxy
delete process.env.https_proxy

let automator
try {
  automator = require('miniprogram-automator')
} catch {
  // Try resolving from pnpm store in node_modules/.pnpm
  const pnpmDir = path.resolve(__dirname, '../node_modules/.pnpm')
  const match = fs.existsSync(pnpmDir) && fs.readdirSync(pnpmDir).find((d) => d.startsWith('miniprogram-automator@'))
  if (match) {
    automator = require(path.join(pnpmDir, match, 'node_modules/miniprogram-automator'))
  } else {
    automator = require('C:/project/memory-client/node_modules/miniprogram-automator')
  }
}

const OUTPUT_ROOT = path.resolve(__dirname, '../logs/miniprogram-check')
const BUILD_PATH = path.resolve(__dirname, '../dist/build/mp-weixin')
const PROJECT_PATH = path.resolve(__dirname, '../dist/dev/mp-weixin')
const DEFAULT_CLI_PATH = 'C:/Program Files (x86)/Tencent/微信web开发者工具/cli.bat'
const SCREENSHOT_DIR = path.join(OUTPUT_ROOT, 'screenshots')
const WXML_DIR = path.join(OUTPUT_ROOT, 'wxml')
const REPORT_DIR = path.join(OUTPUT_ROOT, 'reports')
const LATEST_SCREENSHOT_PATH = path.join(OUTPUT_ROOT, 'ai-inspect.png')
const DEFAULT_PORT = 9527

const PAGE_CONFIGS = [
  { name: 'home', title: '首页', path: '/pages/index/index', query: {}, waitFor: 1200 }
]

function resolveTargetConfig(target) {
  if (!target || target === 'current') return null

  const normalizedTarget = target.startsWith('/') ? target : `/${target}`
  const matched = PAGE_CONFIGS.find(
    (c) => c.name === target || c.title === target || c.path === normalizedTarget,
  )
  if (matched) return matched

  // Support arbitrary route path, e.g. "pages/course/course" or "/pages/course/course?id=1"
  const [rawPath, rawQuery] = normalizedTarget.split('?')
  const query = {}
  if (rawQuery) {
    const params = new URLSearchParams(rawQuery)
    for (const [k, v] of params.entries()) {
      query[k] = v
    }
  }
  const safeName =
    rawPath
      .replace(/^\/+/, '')
      .replace(/\/+/g, '-')
      .replace(/[^a-zA-Z0-9_-]/g, '') || 'custom'

  return {
    name: safeName,
    title: target,
    path: rawPath,
    query,
    waitFor: 1200,
  }
}

function ensureDirs() {
  for (const dir of [OUTPUT_ROOT, SCREENSHOT_DIR, WXML_DIR, REPORT_DIR]) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

function inlineVendorsRecursive(dir, stamp) {
  if (!fs.existsSync(dir)) return
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      inlineVendorsRecursive(fullPath, stamp)
    } else if (entry.isFile() && entry.name.endsWith('.js') && !entry.name.endsWith('-vendor.js')) {
      const content = fs.readFileSync(fullPath, 'utf8')
      const m = content.match(/require\("\.\/([^"]+-vendor\.js)"\)/)
      if (m) {
        const vendorPath = path.join(dir, m[1])
        if (fs.existsSync(vendorPath)) {
          const vendorCode = fs.readFileSync(vendorPath, 'utf8')
          const inlined =
            content.replace(
              `const t=require("./${m[1]}");`,
              `const t=(function(){const exports={};${vendorCode};return exports;})();`,
            ) + `\n// sync-${stamp}\n`
          fs.writeFileSync(fullPath, inlined, 'utf8')
        }
      }
    }
  }
}

function syncBuildToDev() {
  if (!fs.existsSync(BUILD_PATH)) return false
  const buildMarker = path.join(BUILD_PATH, 'app.js')
  const syncMarker = path.join(OUTPUT_ROOT, '.last-build-mtime')
  if (!fs.existsSync(buildMarker)) return false
  const mtime = String(fs.statSync(buildMarker).mtimeMs)
  const prev = fs.existsSync(syncMarker) ? fs.readFileSync(syncMarker, 'utf8').trim() : ''
  if (mtime === prev) return false

  fs.cpSync(BUILD_PATH, PROJECT_PATH, { recursive: true, force: true })
  inlineVendorsRecursive(PROJECT_PATH, Date.now())
  fs.writeFileSync(syncMarker, mtime, 'utf8')
  return true
}

function startAutoPortViaCli(port) {
  return new Promise((resolve, reject) => {
    const cliPath = process.env.WECHAT_CLI_PATH || DEFAULT_CLI_PATH
    if (!fs.existsSync(cliPath)) {
      return reject(new Error(`未找到微信开发者工具 CLI: ${cliPath}`))
    }
    const cmdStr = `""${cliPath}" auto --project "${PROJECT_PATH}" --auto-port ${port} --trust-project"`
    const child = spawn('cmd.exe', ['/d', '/s', '/c', cmdStr], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsVerbatimArguments: true,
    })

    let output = ''
    child.stdout.on('data', (d) => {
      output += String(d)
    })
    child.stderr.on('data', (d) => {
      output += String(d)
    })
    child.on('error', (err) => reject(err))
    child.on('close', (code) => {
      if (code === 0 || output.includes('autoPort')) {
        resolve(output)
      } else {
        reject(new Error(`CLI 启动失败 (exit=${code}): ${output.trim()}`))
      }
    })
  })
}

async function waitForConnect(wsEndpoint, timeoutMs = 30000) {
  const start = Date.now()
  let lastErr
  while (Date.now() - start < timeoutMs) {
    try {
      return await automator.connect({ wsEndpoint })
    } catch (e) {
      lastErr = e
      await new Promise((r) => setTimeout(r, 800))
    }
  }
  throw lastErr || new Error(`连接 ${wsEndpoint} 超时`)
}

function buildUrl(pagePath, queryObj) {
  const normalizedPath = pagePath.startsWith('/') ? pagePath : `/${pagePath}`
  const params = new URLSearchParams()
  if (queryObj && typeof queryObj === 'object') {
    for (const [k, v] of Object.entries(queryObj)) {
      if (v !== undefined && v !== null && v !== '') {
        params.set(k, String(v))
      }
    }
  }
  const qs = params.toString()
  return qs ? `${normalizedPath}?${qs}` : normalizedPath
}

async function inspectTarget(miniProgram, cfg) {
  let page
  if (cfg) {
    const url = buildUrl(cfg.path, cfg.query)
    page = await miniProgram.reLaunch(url)
    await page.waitFor(cfg.waitFor || 1200)
  } else {
    page = await miniProgram.currentPage()
    await page.waitFor(600)
  }

  const name = cfg ? cfg.name : 'current'
  try {
    const root = await page.$('page')
    if (root) {
      const wxml = await root.wxml()
      fs.writeFileSync(path.join(WXML_DIR, `${name}.wxml`), wxml, 'utf8')
    }
  } catch (e) {
    // ignore wxml error
  }
  const screenshotPath = path.join(SCREENSHOT_DIR, `${name}.png`)
  await miniProgram.screenshot({ path: screenshotPath })
  fs.copyFileSync(screenshotPath, LATEST_SCREENSHOT_PATH)

  return {
    name,
    title: cfg ? cfg.title : name,
    screenshotPath,
    latestScreenshotPath: LATEST_SCREENSHOT_PATH,
  }
}

async function main() {
  const args = process.argv.slice(2)
  const target = args.find((a) => !a.startsWith('-')) || 'current'
  const port = DEFAULT_PORT

  ensureDirs()
  const didSync = syncBuildToDev()
  if (didSync) {
    console.log('🔄 已同步最新 build 产物至 dist/dev/mp-weixin，等待开发者工具重编译...')
    await new Promise((r) => setTimeout(r, 2500))
  }
  const wsEndpoint = `ws://127.0.0.1:${port}`
  let miniProgram

  try {
    try {
      miniProgram = await automator.connect({ wsEndpoint })
      if (didSync) {
        try {
          await miniProgram.send('App.exit')
        } catch {}
        await miniProgram.disconnect()
        await startAutoPortViaCli(port)
        miniProgram = await waitForConnect(wsEndpoint, 35000)
      }
    } catch {
      console.log(`⚡ 端口 ${port} 尚未激活，正在通过 CLI 开启微信开发者工具自动化端口...`)
      await startAutoPortViaCli(port)
      miniProgram = await waitForConnect(wsEndpoint, 35000)
    }

    if (target === 'all' || args.includes('--all')) {
      const results = []
      for (const cfg of PAGE_CONFIGS) {
        const res = await inspectTarget(miniProgram, cfg)
        console.log(`✅ 截图完成: ${res.name} -> ${res.screenshotPath}`)
        results.push(res)
      }
      console.log(JSON.stringify(results, null, 2))
    } else {
      const cfg = resolveTargetConfig(target)
      const res = await inspectTarget(miniProgram, cfg)
      console.log(JSON.stringify(res, null, 2))
    }

    await miniProgram.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('❌ 截图检查失败:', err.message)
    if (miniProgram) await miniProgram.disconnect()
    process.exit(1)
  }
}

main()
