import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execSync, spawnSync } from 'node:child_process'
import core from '@actions/core'
import inputs from './inputs'

/**
 * 搜索文件
 * @param root 根路径
 * @param ext 后缀名
 * @return {string[]} 搜索到的文件，返回相对路径
 */
export function glob(root: string, ext: string): string[] {
  const files = fs.readdirSync(root, { recursive: true, encoding: 'utf8' })
  const result: string[] = []
  for (const file of files) {
    if (file.endsWith(ext)) {
      result.push(file)
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

/**
 * 提交文件并推送
 * @param filepath 文件相对路径
 * @param cwd git 仓库路径
 */
export const commitAndPush = (filepath: string, cwd: string) => {
  if (process.env.NODE_ENV === 'production') {
    core.info('Trying commit and push ' + filepath)
    spawnSync('git', ['config', '--global', 'user.name', '"github-actions[bot]"'], { stdio: 'inherit', cwd })
    spawnSync('git', ['config', '--global', 'user.email', '"github-actions[bot]@users.noreply.github.com"'], { stdio: 'inherit', cwd })
  }
  spawnSync('git', ['add', filepath], { stdio: 'inherit', cwd })
  const status = execSync('git status --short | wc -l', { cwd }).toString('utf8')
  if (status === undefined || status === '0') {
    core.debug('Status is ' + status)
    throw Error('Nothing to commit!')
  }
  spawnSync('git', ['commit', '-m', inputs.commitMessage], { stdio: 'inherit', cwd })
  const branch = execSync('git branch --show-current', { cwd }).toString('utf8')

  if (process.env.NODE_ENV === 'production') {
    const push = spawnSync('git', ['push', 'origin', branch], { stdio: 'inherit', cwd })
    if (push.status !== 0) {
      throw Error('Failed to push!')
    }
  }
}