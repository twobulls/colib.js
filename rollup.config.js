import typescript2 from 'rollup-plugin-typescript2';

import pkg from './package.json';
import htmlTemplate from 'rollup-plugin-generate-html-template';
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: false
      }
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      typescript2(),
      htmlTemplate({
        template: 'src/index.html',
        target: 'index.html'
      })
    ]
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false
      }
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [typescript2()]
  }
];
