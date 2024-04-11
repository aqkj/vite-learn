#!/usr/bin/env node
import { performance } from 'node:perf_hooks'
// 如果不是node_modules中的包 也就是开发模式下
if (!import.meta.url.includes('node_modules')) {
  try {
    // source-map-support 用于将错误堆栈映射到源代码
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

/**
 * 运行vite
 */
function start() {
  // 引入包
  return import('../dist/node/cli.js')
}
// 如果存在profile参数 用于启用调试功能
if (profileIndex > 0) {
  // 删除profile参数
  process.argv.splice(profileIndex, 1)
  // 获取profile参数值
  const next = process.argv[profileIndex]
  // 如果profile参数值存在并且不以-开头,以-开头说明是个参数不是一个value
  if (next && !next.startsWith('-')) {
    // 删除profile参数值
    process.argv.splice(profileIndex, 1)
  }
  // nodejs调试
  const inspector = await import('node:inspector').then((r) => r.default)
  // 创建一个新的会话
  const session = (global.__vite_profile_session = new inspector.Session())
  // 连接会话
  session.connect()
  // 启用Profiler
  session.post('Profiler.enable', () => {
    // 开始Profiler
    session.post('Profiler.start', start)
  })
} else {
  // 直接运行
  start()
}
