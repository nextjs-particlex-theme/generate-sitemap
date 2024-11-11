import tryBindPage from '../../src/core/bind'
import inputs, { TEST_VISIT_PATH } from '../../src/inputs'
import type { SitemapRecordItem, XMLSitemapUrl } from '../../src/core/sitemap'
import generateSitemapXML from '../../src/core/sitemap'
import path from 'node:path'
import { formatTime, md5 } from '../../src/util'


function parseXmlByRegx(sitemapXml: string): XMLSitemapUrl[] {
  const SEARCH_REGX = /<url>\n *<loc>(?<loc>.+)<\/loc>\n *<lastmod>(?<lastmod>.+)<\/lastmod>\n *<changefreq>(?<changefreq>.+)<\/changefreq>\n *<priority>(?<priority>.+)<\/priority>\n *<\/url>/gm
  const result: XMLSitemapUrl[] = []
  let searchResult: RegExpExecArray | null = null
  while ((searchResult = SEARCH_REGX.exec(sitemapXml))) {
    const group = searchResult.groups!
    expect(group).not.toBeNull()
    result.push({
      loc: group.loc,
      lastmod: group.lastmod,
      changefreq: group.changefreq,
      priority: group.priority
    })
  }
  return result
}

test('Test new sitemap generate', async () => {
  const target = ['hello.md', `_post${path.sep}index.md`]
  const bound = tryBindPage(inputs.pagesPath, target)

  const today = formatTime()

  const [generated, _] = await generateSitemapXML({
    basepath: TEST_VISIT_PATH,
    pages: bound,
    calculateHash: (page) => {
      return md5(page.filepath)
    },
    oldRecord: {}
  })
  const generatedUrls = parseXmlByRegx(generated)

  const testUrl = new URL(TEST_VISIT_PATH)

  for (const generatedUrl of generatedUrls) {
    expect(generatedUrl.lastmod).toBe(today)
    const url = new URL(generatedUrl.loc)

    expect(bound.find(value => value.webPathname === url.pathname)).not.toBeNull()
    expect(url.host).toBe(testUrl.host)
    expect(url.port).toBe(testUrl.port)
    expect(url.protocol).toBe(testUrl.protocol)
  }

  expect(generatedUrls.length).toBe(target.length)
})

test('Test sitemap update', async () => {
  const target = ['hello.md']
  const bound = tryBindPage(inputs.pagesPath, target)

  const testUrl = new URL(TEST_VISIT_PATH)
  testUrl.pathname = '/hello'

  const lastmod = formatTime(2020, 1, 1)
  const item: SitemapRecordItem = {
    lastmod,
    priority: '0.3',
    changefreq: 'weekly',
    sha: ''
  }

  const [generated, _] = await generateSitemapXML({
    basepath: TEST_VISIT_PATH,
    pages: bound,
    calculateHash: (page) => {
      return md5(page.filepath)
    },
    oldRecord: {
      [testUrl.href]: item
    }
  })

  const generatedUrls = parseXmlByRegx(generated)

  expect(generatedUrls.length).toBe(1)

  const url = generatedUrls[0]
  expect(url.lastmod).not.toBe(lastmod)
  expect(item.sha).not.toBeFalsy()
})
