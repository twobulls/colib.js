import typescript2 from 'rollup-plugin-typescript2';
import * as fs from 'fs';
import pkg from './package.json';
import htmlTemplate from 'rollup-plugin-generate-html-template';
// import scss from 'rollup-plugin-sass';
// import sass from 'node-sass';
// import postcss from 'postcss';
// import autoprefixer from 'autoprefixer';
// import CleanCSS from 'clean-css';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import resolve from 'rollup-plugin-node-resolve';
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'iife',
        sourcemap: false,
        name: 'bundle'
      }
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    plugins: [
      resolve(),
      typescript2({
        tsconfig: 'tsconfig.json'
      }),
      htmlTemplate({
        template: 'src/index.html',
        target: 'index.html'
      }),
      // scss({
      //   output: function (styles, styleNodes) {
      //     console.log('ddd');
      //     postcss([autoprefixer]).process(styles).then(result => {
      //       result.warnings().forEach(warn => {
      //         console.warn(warn.toString());
      //       });
      //       let minified = new CleanCSS({}).minify(result.css);
      //       fs.writeFileSync('dist/styles/style.css', minified.styles);
      //     });
      //   }
      // }),
      serve({
        host: '127.0.0.1',
        port: 4201,
        contentBase: './dist'
      }),
      livereload()
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
    plugins: [
      typescript2({
        tsconfig: 'tsconfig.json'
      })
    ]
  }
];
