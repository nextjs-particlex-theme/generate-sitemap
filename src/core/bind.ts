import inputs from '../inputs'
import fs from 'node:fs'
import path from 'node:path'
import { debug, warn } from '../logger'

export type BoundPage = {
  filepath: string
  webPathname: string
}

function trimMarkdownExtSuffix(filename: string): string {
  if (filename.endsWith('.md')) {
    return filename.substring(0, filename.length - 3)
  } else if (filename.endsWith('.mdx')) {
    return filename.substring(0, filename.length - 4)
  }
  return filename
}

function findUntilEmpty(filePath: string): string | undefined{
  const target = trimMarkdownExtSuffix(filePath.substring(0, filePath.length - 3))
  const searchTarget = path.join(inputs.outputPath, target + '.html')
  if (fs.existsSync(searchTarget)) {
    return target
  } else {
    debug(`File \`${searchTarget}\` is not exist.`)
  }
  const pos = filePath.indexOf(path.sep)
  if (pos < 0) {
    return
  }
  return findUntilEmpty(filePath.substring(pos + path.sep.length))
}

/**
 * 尝试将 markdown 文件与 html 文件绑定.
 * <p>
 * 每个 md 文件应该对应一个输出中的 HTML 文件，如果没有找到，则去掉前面的一层路径继续找
 * @param root md 文件的根路径
 * @param paths
 */
export default function tryBindPage(root: string, paths: string[]): BoundPage[] {
  const result: BoundPage[] = []
  for (const filePath of paths) {
    debug(`Trying to search the web path of '${filePath}'`)
    const webPath = findUntilEmpty(filePath)
    if (webPath) {
      result.push({ webPathname: webPath, filepath: path.resolve(root, filePath) })
    } else {
      warn('No correspondent page find for ' + filePath)
    }
  }
  return result
}