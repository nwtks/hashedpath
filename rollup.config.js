import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'

export default [
  {
    input: 'src/hashpath.js',
    output: {
      file: 'dist/hashpath.js',
      format: 'cjs'
    },
    plugins: [buble()]
  },
  {
    input: 'src/hashpath.js',
    output: {
      name: 'hashpath',
      file: 'dist/hashpath.min.js',
      format: 'umd'
    },
    plugins: [buble(), uglify()]
  }
]
