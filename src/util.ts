import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execSync, spawnSync } from 'node:child_process'
import core from '@actions/core'
import inputs from './inputs'
import { info } from './logger'

/**
 * 搜索文件
 * @param root 根路径
 * @param exts 后缀名
 * @return {string[]} 搜索到的文件，返回相对路径
 */
export function glob(root: string, ...exts: string[]): string[] {
  const files = fs.readdirSync(root, { recursive: true, encoding: 'utf8' })
  const result: string[] = []
  for (const file of files) {
    for (const ext of exts) {
      if (file.endsWith(ext)) {
        result.push(file)
        break
      }
    }
  }
  return result
}

/**
 * 读取文件内容，如果文件不存在，返回空
 */
export function readFileContent(path: string): string | undefined {
  if (!fs.existsSync(path)) {
    return
  }
  return fs.readFileSync(path, { encoding: 'utf8' })
}

/**
 * 计算字符串 md5
 * @param content 字符串内容
 */
export const md5 = (content: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = createHash('md5')
    hash.on('error', (err: Error) => {
      reject(err)
    })

    hash.on('readable', () => {
      const data = hash.read()
      if (data) {
        resolve(data.toString('hex'))
      } else {
        reject('Empty data!')
      }
    })

    hash.write(content)
    hash.end()
  })
}

function spawnSyncAndEnsureSuccess(...args: Parameters<typeof spawnSync>) {
  const r = spawnSync(...args)
  if (r.status !== 0) {
    throw new Error('Execute command failed, args: ' + JSON.stringify(args))
  }
}

/**
 * 提交文件并推送
 * @param filepath 文件相对路径
 * @param cwd git 仓库路径
 */
export const commitAndPush = (filepath: string, cwd: string) => {
  info('Trying commit and push ' + filepath)
  spawnSyncAndEnsureSuccess('git', ['config', '--global', 'user.name', '"github-actions[bot]"'], { stdio: 'inherit', cwd })
  spawnSyncAndEnsureSuccess('git', ['config', '--global', 'user.email', '"github-actions[bot]@users.noreply.github.com"'], { stdio: 'inherit', cwd })
  spawnSyncAndEnsureSuccess('git', ['add', filepath], { stdio: 'inherit', cwd })

  const status: string = execSync('git status --short', { cwd }).toString('utf8').trim()

  if (status === '') {
    core.debug('Status is ' + status)
    info('Nothing to commit, skip push.')
    return
  }

  spawnSyncAndEnsureSuccess('git', ['commit', '-m', inputs.commitMessage], { stdio: 'inherit', cwd })
  const branch = execSync('git branch --show-current', { cwd }).toString('utf8').trim()

  if (process.env.NODE_ENV === 'production') {
    spawnSyncAndEnsureSuccess('git', ['push', 'origin', branch], { stdio: 'inherit', cwd })
  }
}

/**
 * 格式化时间，返回 2020-01-01 格式的时间，会自动补零.
 * @param year 年，不填默认使用当前年
 * @param month 月，不填默认使用当前月份
 * @param date 日期，不填默认使用当前日期
 */
export const formatTime = (
  year?: string | number,
  month?: string | number, 
  date?: string| number): string => {
  const today = new Date()
  if (!year) {
    year = today.getFullYear()
  }
  if (!month) {
    month = today.getMonth() + 1
  }
  if (!date) {
    date = today.getDate()
  }
  if (typeof month === 'number') {
    month = month.toString()
  }
  if (typeof date === 'number') {
    date = date.toString()
  }
  return `${year}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`
}