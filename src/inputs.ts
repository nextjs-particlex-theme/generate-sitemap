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
  const sourcePath = core.getInput('source-path')
  const outputPath = core.getInput('output-path')
  const sitemapPath = core.getInput('sitemap-cache-file')
  const visitPath = core.getInput('web-base-path')

  const vcsRoot = path.resolve(process.env.GITHUB_WORKSPACE, sourcePath)
  return {
    root: vcsRoot,
    outputPath: path.resolve(process.env.GITHUB_WORKSPACE, outputPath),
    cacheFilePath: path.resolve(vcsRoot, sitemapPath),
    basePath: visitPath,
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

