declare namespace NodeJS {
  export interface ProcessEnv {
    readonly GITHUB_WORKSPACE: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}