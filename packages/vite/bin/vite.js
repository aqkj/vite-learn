#!/usr/bin/env node
import { performance } from 'node:perf_hooks'

if (!import.meta.url.includes('node_modules')) {
  try {
    // only available as dev dependency
    await import('source-map-support').then((r) => r.default.install())
  } catch (e) {}
}
// 获取启动时间
global.__vite_start_time = performance.now()
// 检查是否是存在debug参数
// check debug mode first before requiring the CLI.
const debugIndex = process.argv.findIndex((arg) => /^(?:-d|--debug)$/.test(arg))
// 检查是否存在filter参数
const filterIndex = process.argv.findIndex((arg) =>
  /^(?:-f|--filter)$/.test(arg),
)
// 检查是否存在profile参数
const profileIndex = process.argv.indexOf('--profile')
// 如果存在debug参数
if (debugIndex > 0) {
  // 获取debug参数值
  let value = process.argv[debugIndex + 1]
  // 如果值不存在或者以-开头,以-开头说明是个参数不是一个value
  if (!value || value.startsWith('-')) {
    // 默认值
    value = 'vite:*'
  } else {
    // 使用逗号分隔来支持多个标志支持调试
    // support debugging multiple flags with comma-separated list
    value = value
      .split(',')
      .map((v) => `vite:${v}`)
      .join(',')
  }
  // 如果环境变量中存在debug,则将参数值value追加进去
  process.env.DEBUG = `${
    process.env.DEBUG ? process.env.DEBUG + ',' : ''
  }${value}`
  // 判断是否存在filter参数
  if (filterIndex > 0) {
    // 获取filter参数值
    const filter = process.argv[filterIndex + 1]
    // 如果filter存在并且不以-开头,以-开头说明是个参数不是一个value
    if (filter && !filter.startsWith('-')) {
      // 将filter参数值赋值给环境变量VITE_DEBUG_FILTER
      process.env.VITE_DEBUG_FILTER = filter
    }
  }
}

function start() {
  return import('../dist/node/cli.js')
}

if (profileIndex > 0) {
  process.argv.splice(profileIndex, 1)
  const next = process.argv[profileIndex]
  if (next && !next.startsWith('-')) {
    process.argv.splice(profileIndex, 1)
  }
  const inspector = await import('node:inspector').then((r) => r.default)
  const session = (global.__vite_profile_session = new inspector.Session())
  session.connect()
  session.post('Profiler.enable', () => {
    session.post('Profiler.start', start)
  })
} else {
  start()
}
