import fs from 'node:fs'
import { formatTime, md5 } from '../util'
import type { BoundPage } from './bind'
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
 * 生成 sitemap
 * @param basepath 网站访问域名
 * @param items 要生成的 sitemap url
 * @param sitemapRecord 旧的 sitemap 内容. 将会修改该对象的内容，如果没有可用的对象，应该传入一个空对象来获取修改后的设置，以便于持久化
 */
export default async function generateSitemapXML(basepath: string, items: BoundPage[], sitemapRecord: SitemapRecord): Promise<string> {

  const lastmod = formatTime()

  const urls: XMLSitemapUrl[] = []

  for (const item of items) {
    const url = new URL(item.webPathname, basepath)
    const record = sitemapRecord[url.href]
    const newSha = await md5(fs.readFileSync(item.filepath, 'utf8'))
    debug(`The hash of file ${item.filepath} is '${newSha}'`)
    if (!record) {
      sitemapRecord[url.href] = {
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

  for (const key of Object.keys(sitemapRecord)) {
    const item = sitemapRecord[key]
    urls.push({
      loc: key,
      changefreq: item.changefreq,
      lastmod: item.lastmod,
      priority: item.priority
    })
  }

  return Promise.resolve(buildXml(urls))
}