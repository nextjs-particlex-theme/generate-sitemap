// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import nodeResolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import terser from "@rollup/plugin-terser"

export default {
  input: 'src/main.ts',
  output: {
    file: 'dest/bundle.js',
    format: 'es',
    compact: true,
  },
  plugins: [typescript(),commonjs(), nodeResolve(), terser()]
}
