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

function getOriginalInputs():OriginalInputs {
  if (process.env.NODE_ENV === 'production') {
    return {
      sourcePath: core.getInput('source-path'),
      outputPath: core.getInput('output-path'),
      pagesPath: core.getInput('pages-path'),
      sitemapCacheFile: core.getInput('sitemap-cache-file'),
      webBasePath: core.getInput('web-base-path'),
      commitMessage: core.getInput('commit-message'),
    }
  }
  if (global.originalInput) {
    return global.originalInput
  }
  throw new Error('No inputs found!')
}

function parseInputs(): Inputs {
  const originalInputs = getOriginalInputs()
  const basePath = process.env.NODE_ENV === 'production' ? process.env.GITHUB_WORKSPACE : ''

  const vcsRoot = path.resolve(basePath, originalInputs.sourcePath)

  return {
    root: vcsRoot,
    pagesPath: path.resolve(vcsRoot, originalInputs.pagesPath),
    cacheFilePath: path.resolve(vcsRoot, originalInputs.sitemapCacheFile),
    basePath: originalInputs.webBasePath,
    commitMessage: originalInputs.commitMessage,
    outputPath: path.resolve(basePath, originalInputs.outputPath),
  }
}

const inputs = parseInputs()

export default inputs

