# Generate-Sitemap

> [!IMPORTANT]
> 
> 由于很难计算每次打包后文件的哈希(因为每次打包 CSS 啥的链接会变)，已弃用，现在 particlex 框架自带 sitemap 生成功能。

一个 **专门** 用于 [particlex](https://github.com/nextjs-particlex-theme/particlex) 主题的 Github Action，用于生成 sitemap。

> [!CAUTION]
>
> 每执行一次该 Action ，都会在你的仓库中自动生成一次提交用于记录上次文件修改时间!

## 快速开始

```yaml
job:
  build:
    steps:

      # 你自己存放 markdown 的仓库
      - name: Checkout Datasource Repository
        uses: actions/checkout@v4
        with:
          path: datasource

      # Particlex 仓库
      - name: Checkout Main Repository 
        uses: actions/checkout@v4
        with:
          repository: IceOfSummer/nextjs-particlex-theme
          ref: master
          path: nextjs-particlex-theme

      # snip...

      - name: Generate sitemap
        uses: nextjs-particlex-theme/generate-sitemap@master
        env:
          # IMPORTANT! 如果你想要提交 issue，请开启该功能以提供完全的调用栈!
          NODE_OPTIONS: "--enable-source-maps"
        with:
        source-path: 'datasource'
        output-path: 'nextjs-particlex-theme/out'
        pages-path: 'source'
        web-base-path: 'https://iceofsummer.github.io/'

```

### Parameters


> [!NOTE]
>
> `<null>` 代表必填。

| 属性                   | 默认值                          | 说明                                      |
|----------------------|------------------------------|-----------------------------------------|
| `source-path`        | `datasource`                 | 你自己的仓库，用于提交sitemap文件的缓存                 |
| `output-path`        | `nextjs-particlex-theme/out` | HTML构建的输出目录                             |
| `pages-path`         | `source`                     | 存放所有markdown文件的目录, 是相对于`source-path`的路径 |
| `sitemap-cache-file` | `sitemap-cache.json`         | sitemap缓存文件存放位置                         |
| `web-base-path`      | `<null>`                     | 网站 basePath                             |
| `commit-message`     | `Update sitemap-cache.json`  | 提交时的提交信息                                |


如果你的博客从 hexo 迁移过来，那么你不需要任何配置(前提是你没有修改 `actions/checkout@v4` 的 `path` 参数)。