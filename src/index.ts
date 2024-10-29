import { commitAndPush, glob, readFileContent } from './util'
import inputs from './inputs'
import type { SitemapRecord } from './sitemap'
import generateSitemapXML from './sitemap'
import path from 'node:path'
import fs from 'node:fs'
import { debug, info } from './logger'

async function main() {
  const cacheFileContent = readFileContent(inputs.cacheFilePath)
  let cache: SitemapRecord

  debug('Config is: ' + JSON.stringify(inputs))

  if (cacheFileContent === undefined) {
    info('No sitemap in vcs!')
    cache = {}
  } else {
    cache = JSON.parse(cacheFileContent)
  }
  const suf = '.html'

  info('Search files in ' + inputs.outputPath)
  const files = glob(inputs.outputPath, suf)
  const xml = await generateSitemapXML(files.map(relativePath => {
    const pathname = relativePath.substring(0, relativePath.length - suf.length)
    return {
      pathname,
      filepath: path.join(inputs.outputPath, relativePath),
      basePath: inputs.basePath
    }
  }), cache)

  info('Writing sitemap.xml...')
  fs.writeFileSync(path.join(inputs.outputPath, 'sitemap.xml'), xml, { encoding: 'utf8' })
  info('Writing cache file...')
  fs.writeFileSync(inputs.cacheFilePath, JSON.stringify(cache), 'utf8')

  commitAndPush(path.basename(inputs.cacheFilePath), inputs.root)
}

main()

