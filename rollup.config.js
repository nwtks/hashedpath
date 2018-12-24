import buble from 'rollup-plugin-buble';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'src/hashedpath.js',
    output: {
      file: 'dist/hashedpath.js',
      format: 'cjs'
    },
    plugins: [buble()]
  },
  {
    input: 'src/hashedpath.js',
    output: {
      name: 'hashedpath',
      file: 'dist/hashedpath.min.js',
      format: 'umd'
    },
    plugins: [buble(), uglify()]
  }
];
