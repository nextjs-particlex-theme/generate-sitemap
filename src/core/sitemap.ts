import { formatTime } from '../util'
import { debug } from '../logger'


export type XMLSitemapUrl = {
  loc: string,
  priority: string,
  lastmod: string,
  changefreq: string,
}

export type SitemapRecordItem = {
  priority: string,
  lastmod: string,
  changefreq: string,
  /**
   * use md5
   */
  sha: string
}

/**
 * 访问全路径(loc的值) -> SitemapRecordItem
 */
export type SitemapRecord = Record<string, SitemapRecordItem>

function buildXml(urls: XMLSitemapUrl[]) {

  const builder = [`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">`]

  for (const url of urls) {
    builder.push(`\n<url>
  <loc>${url.loc}</loc>
  <lastmod>${url.lastmod}</lastmod>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
</url>`)
  }

  builder.push('\n</urlset>')
  return builder.join('')
}


/**
 * 文章 pathname
 */
interface Page {
  webPathname: string
}

export type GenerateOptions<T extends Page> = {
  basepath: string
  pages: T[]
  oldRecord?: SitemapRecord
  /**
   * 计算页面哈希
   * @param page 页面
   * @return {string} 哈希值
   */
  calculateHash: (page: T) => Promise<string>
}

/**
 * 生成 sitemap
 * @param generateOptions 设置
 * @return {} 数组第一个返回生成的 xml，第二个返回新的 {@link SitemapRecord}
 */
export default async function generateSitemapXML<T extends Page>(generateOptions: GenerateOptions<T>): Promise<[string, SitemapRecord]> {

  const newRecord: SitemapRecord = {
    ...generateOptions.oldRecord
  }

  const lastmod = formatTime()

  const urls: XMLSitemapUrl[] = []

  for (const page of generateOptions.pages) {
    const url = new URL(page.webPathname, generateOptions.basepath)
    const record = newRecord[url.href]
    const newSha = await generateOptions.calculateHash(page)
    debug(`The hash of the page ${page} is '${newSha}'`)
    if (!record) {
      newRecord[url.href] = {
        sha: newSha,
        lastmod,
        changefreq: 'weekly',
        priority: '0.3'
      }
      continue
    }
    if (newSha != record.sha) {
      record.sha = newSha
      record.lastmod = lastmod
    }
  }

  for (const key of Object.keys(newRecord)) {
    const item = newRecord[key]
    urls.push({
      loc: key,
      changefreq: item.changefreq,
      lastmod: item.lastmod,
      priority: item.priority
    })
  }

  return Promise.resolve([buildXml(urls), newRecord])
}