
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly GITHUB_WORKSPACE: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}


type OriginalInputs = {
  sourcePath: string
  outputPath: string
  pagesPath: string
  sitemapCacheFile: string
  webBasePath: string
  commitMessage: string
}
declare namespace global {
  export let originalInput: OriginalInputs | undefined
}

