// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/main.ts',
  output: {
    file: 'dest/bundle.js',
    format: 'es'
  },
  plugins: [typescript()]
}
