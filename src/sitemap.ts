import xml2js from 'xml2js';
import fs from "node:fs";
import {md5} from "./util";

type IndexedSiteMap = {
  xml: XMLSiteMap,
  pathToIndex: Record<string, number>
}

type XMLSiteMap = {
  '$': Record<string, string>
  urlset: {
    url: Array<XMLSitemapUrl>
  }
}

type XMLSitemapUrl = {
  loc: [string],
  priority: [string],
  lastmod: [string],
  changefreq: [string],
}

export async function parseSitemapXML(xml: string): Promise<IndexedSiteMap> {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {async: true}, (err, xml) => {
      if (err) {
        reject(err);
        return;
      }
      const parsed = xml as XMLSiteMap
      const index: Record<string, number> = {}
      const urls = parsed.urlset.url
      for (let i = 0; i < urls.length; i++) {
        const url = new URL(urls[i].loc[0])
        index[url.pathname] = i
      }
      resolve({
        xml: parsed,
        pathToIndex: index
      });
    });
  })
}

type SitemapGenerateItem = {
  /**
   * 访问的根路径。
   */
  basePath: string
  /**
   * 对应的文件路径
   */
  filepath: string
  /**
   * url 的 pathname
   */
  pathname: string
}

type SitemapRecordItem = {
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



/**
 * 生成 sitemap
 * @param items 要生成的 sitemap url
 * @param sitemapRecord 旧的 sitemap 内容. 将会修改该对象的内容，如果没有可用的对象，应该传入一个空对象来获取修改后的设置，以便于持久化
 */
export default async function generateSitemapXML(items: SitemapGenerateItem[], sitemapRecord: SitemapRecord): Promise<string> {

  const date = new Date()
  const lastmod = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const urls: XMLSitemapUrl[] = []
  let root: XMLSiteMap = {
    '$': {
      xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9\nhttp://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd'
    },
    urlset: {
      url: urls
    }
  }

  for (let item of items) {
    const url = new URL(item.pathname, item.basePath)
    const record = sitemapRecord[url.href]
    const newSha = await md5(fs.readFileSync(item.filepath, 'utf8'))
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

  for (let key of Object.keys(sitemapRecord)) {
    const item = sitemapRecord[key]
    urls.push({
      loc: [key],
      changefreq: [item.changefreq],
      lastmod: [item.lastmod],
      priority: [item.priority]
    })
  }

  const builder = new xml2js.Builder()
  return Promise.resolve(builder.buildObject(root))
}