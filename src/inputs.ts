import core from '@actions/core'
import path from 'node:path'

export const TEST_VISIT_PATH = 'https://foo.bar'

type Inputs = {
  /**
   * 项目根路径. 绝对路径
   */
  root: string
  /**
   * HTML 输出路径
   */
  outputPath: string
  /**
   * sitemap 路径
   */
  cacheFilePath: string
  /**
   * 访问路径
   */
  basePath: string
  /**
   * 提交信息
   */
  commitMessage: string
}


function getTestInputs(): Inputs {
  const root = path.resolve('test/__templates__')
  return {
    root,
    cacheFilePath: path.join(root, 'sitemap-cache.json'),
    outputPath: path.join(root, 'out'),
    basePath: TEST_VISIT_PATH,
    commitMessage: 'Msg'
  }
}

function getProductionInputs(): Inputs {
  const originalInput = {
    sourcePath: core.getInput('source-path'),
    outputPath: core.getInput('output-path'),
    sitemapPath: core.getInput('sitemap-cache-file'),
    visitPath: core.getInput('base-path'),
  }


  const root = path.isAbsolute(originalInput.sourcePath) ?
    originalInput.sourcePath : path.resolve(process.env.GITHUB_WORKSPACE, originalInput.sourcePath)
  core.debug(`Source directory is ${root}`)

  return {
    root,
    outputPath: path.resolve(root, originalInput.outputPath),
    cacheFilePath: path.resolve(root, originalInput.sitemapPath),
    basePath: originalInput.visitPath,
    commitMessage: core.getInput('commit-message')
  }
}


function parseInputs(): Inputs {
  if (process.env.NODE_ENV === 'test') {
    return getTestInputs()
  }
  return getProductionInputs()
}

const inputs = parseInputs()

export default inputs

