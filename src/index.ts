import { commitAndPush, glob, md5, readFileContent } from './util'
import inputs from './inputs'
import type { SitemapRecord } from './core/sitemap'
import generateSitemapXML from './core/sitemap'
import path from 'node:path'
import fs from 'node:fs'
import { debug, info, isDebug } from './logger'
import tryBindPage from './core/bind'


function readOldSitemapCache() {
  const cacheFileContent = readFileContent(inputs.cacheFilePath)
  let cache: SitemapRecord
  if (cacheFileContent === undefined) {
    info('No sitemap in vcs!')
    cache = {}
  } else {
    cache = JSON.parse(cacheFileContent)
  }
  return cache
}

async function main() {

  if (isDebug()) {
    debug('Config is: ' + JSON.stringify(inputs))
  }

  info('Search files in ' + inputs.pagesPath)
  const bound = tryBindPage(inputs.pagesPath, glob(inputs.pagesPath, '.md', '.mdx'))

  if (isDebug()) {
    debug('Bound pages: \n' + JSON.stringify(bound))
  }

  const [xml, record] = await generateSitemapXML({
    basepath: inputs.basePath,
    calculateHash: page => {
      return md5(page.filepath)
    },
    oldRecord: readOldSitemapCache(),
    pages: bound
  })

  info('Writing sitemap.xml...')
  fs.writeFileSync(path.join(inputs.outputPath, 'sitemap.xml'), xml, { encoding: 'utf8' })
  info('Writing cache file...')
  fs.writeFileSync(inputs.cacheFilePath, JSON.stringify(record), 'utf8')

  if (process.env.NODE_ENV === 'production') {
    commitAndPush(path.basename(inputs.cacheFilePath), inputs.root)
  }
}

main()

