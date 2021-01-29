import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default [{
  input: 'src/koi.js',
  output: {
    file: 'dist/koi.js',
    format: 'cjs'
  },
  plugins: [
    resolve({ preferBuiltins: false }),
    commonjs(),
    json(),
    nodePolyfills()
  ]
}];