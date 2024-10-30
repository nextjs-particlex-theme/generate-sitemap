import inputs from '../inputs'
import fs from 'node:fs'
import path from 'node:path'
import { warn } from '../logger'

export type BoundPage = {
  filepath: string
  webPathname: string
}

function getBaseNameWithoutSuffix(filePath: string): string {
  const basename = path.basename(filePath)
  if (basename.endsWith('.md')) {
    return basename.substring(0, basename.length - 3)
  } else if (basename.endsWith('.mdx')) {
    return basename.substring(0, basename.length - 4)
  }
  return basename
}


function findUntilEmpty(filePath: string): string | undefined{
  // remove .md suffix
  const target = filePath.substring(0, filePath.length - 3)
  if (fs.existsSync(path.join(inputs.outputPath, target + '.html'))) {
    return getBaseNameWithoutSuffix(filePath)
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
    const webPath = findUntilEmpty(filePath)
    if (webPath) {
      result.push({ webPathname: webPath, filepath: path.resolve(root, filePath) })
    } else {
      warn('No correspondent page find for ' + path.resolve(root, filePath))
    }
  }
  return result
}