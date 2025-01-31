import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import postcss from 'rollup-plugin-postcss';
import url from 'postcss-url';
import replace from '@rollup/plugin-replace';
import {version} from './package.json';

const output = (name, format) => ({
  name,
  file: `dist/webexWidgets.${format}.js`,
  format,
  sourcemap: true,
  globals: {
    'prop-types': 'PropTypes',
    react: 'React',
    'react-dom': 'ReactDOM',
    webex: 'webex',
    '@webex/common': '@webex/common',
  },
});

export default [
  {
    input: 'src/index.js',
    output: [output('ESMWebexWidgets', 'esm')],
    plugins: [
      replace({
        include: ['src/widgets/WebexMeeting/WebexMeeting.jsx'],
        values: {
          __appVersion__: JSON.stringify(version)
        },
      }),
      resolve({
        preferBuiltins: true,
        extensions: ['.js', '.jsx'],
      }),
      babel({
        compact: false,
        runtimeHelpers: true,
        babelrc: true,
      }),
      commonJS(),
      json(),
      postcss({
        extract: 'webexWidgets.css',
        minimize: true,
        plugins: [
          url({
            url: 'copy',
            assetsPath: 'assets/',
            useHash: true,
          }),
        ],
        // to is required by the postcss-url plugin to
        // properly resolve assets path
        to: 'dist/webexWidgets.css',
      }),
    ],
    external: ['prop-types', 'react', 'react-dom', 'webex', '@webex/common'],
    context: null,
  },
];
