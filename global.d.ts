
declare namespace NodeJS {
  export interface ProcessEnv {
    readonly GITHUB_WORKSPACE: string
    readonly NODE_ENV: 'development' | 'production' | 'test'
  }
}

declare namespace global {
  import type { OriginalInputs } from './src/inputs'
  // eslint-disable-next-line no-var
  export var originalInput: OriginalInputs | undefined
}

