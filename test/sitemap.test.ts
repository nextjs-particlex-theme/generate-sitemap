import { TEST_VISIT_PATH } from '../src/inputs'
import type { SitemapRecord } from '../src/core/sitemap'
import generateSitemapXML from '../src/core/sitemap'


test('Test generateSitemapXML with old data', async () => {
  const map = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
       http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"
>

<url>
 <loc>${TEST_VISIT_PATH}/</loc>
 <priority>0.3</priority>
 <lastmod>2024-10-21</lastmod>
 <changefreq>weekly</changefreq>
</url>
</urlset>
`
  const date = new Date()
  const lastmod = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

  const record: SitemapRecord = {}
  // FIXME
  const xmlContent = await generateSitemapXML(TEST_VISIT_PATH, [{ webPathname: '/', filepath: '/' }], record)
  expect(xmlContent).not.toEqual(map)

  expect(record[TEST_VISIT_PATH + '/'].lastmod).toEqual(lastmod)
})