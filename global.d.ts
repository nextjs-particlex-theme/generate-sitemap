import type { OriginalInputs } from './src/inputs'


declare global {
  // eslint-disable-next-line no-var
  var originalInput: OriginalInputs | undefined
}
