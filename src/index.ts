import { commitAndPush, glob, readFileContent } from './util'
import inputs from './inputs'
import type { SitemapRecord } from './core/sitemap'
import generateSitemapXML from './core/sitemap'
import path from 'node:path'
import fs from 'node:fs'
import { debug, info } from './logger'
import tryBindPage from './core/bind'

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

  info('Search files in ' + inputs.pagesPath)
  const files = glob(inputs.pagesPath, '.md', '.mdx')

  const bound = tryBindPage(inputs.pagesPath, files)

  debug('Bound pages: \n' + JSON.stringify(bound))

  const xml = await generateSitemapXML(inputs.basePath, bound, cache)

  info('Writing sitemap.xml...')
  fs.writeFileSync(path.join(inputs.outputPath, 'sitemap.xml'), xml, { encoding: 'utf8' })
  info('Writing cache file...')
  fs.writeFileSync(inputs.cacheFilePath, JSON.stringify(cache), 'utf8')

  if (process.env.NODE_ENV === 'production') {
    commitAndPush(path.basename(inputs.cacheFilePath), inputs.root)
  }
}

main()

