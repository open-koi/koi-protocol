import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodePolyfills from "rollup-plugin-node-polyfills";

export default [
  {
    input: "src/Koi.js",
    output: {
      file: "dist/koi.js",
      format: "cjs",
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      json(),
      nodePolyfills(),
    ],
  },
  {
    input: "src_attention/koi_attention.js",

    output: {
      file: "dist/koi_attention.js",
      format: "cjs",
    },
    plugins: [
      resolve({ preferBuiltins: false }),
      commonjs(),
      json(),
      nodePolyfills(),
    ],
  },
];
