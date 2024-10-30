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
   * 存放所有页面的路径
   */
  pagesPath: string
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
  const testRoot = path.resolve('test')
  return {
    root: path.resolve(testRoot, '__source__'),
    cacheFilePath: path.join(testRoot, '__templates__/sitemap-cache.json'),
    pagesPath: path.join(testRoot, '__source__'),
    basePath: TEST_VISIT_PATH,
    commitMessage: 'Msg',
    outputPath: path.resolve(testRoot, '__templates__')
  }
}

function getProductionInputs(): Inputs {
  const sourcePath = core.getInput('source-path')
  const sitemapPath = core.getInput('sitemap-cache-file')
  const visitPath = core.getInput('web-base-path')

  const vcsRoot = path.resolve(process.env.GITHUB_WORKSPACE, sourcePath)
  return {
    root: vcsRoot,
    pagesPath: path.resolve(vcsRoot, core.getInput('pages-path')),
    cacheFilePath: path.resolve(vcsRoot, sitemapPath),
    basePath: visitPath,
    commitMessage: core.getInput('commit-message'),
    outputPath: path.resolve(vcsRoot, core.getInput('output-path')),
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

