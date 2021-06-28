import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';

const plugins = [
    replace({
        preventAssignment: true
    }),
    commonjs(),
    resolve({
    })
];

if (process.env.MINIFY) {
    plugins.push(terser());
}

export default {
    input: `./es/index${process.env.BROWSER ? '.browser' : '.node'}.js`,
    output: {
        file: `dist/cjs/index${process.env.BROWSER ? '.browser' : '.node'}${process.env.MINIFY ? '.min' : ''}.js`,
        format: 'umd',
        name: 'Iota',
        compact: process.env.MINIFY,
        globals: {
            "node-fetch": "node-fetch",
            "crypto": "crypto",
            "big-integer": "big-integer"
        }
    },
    external: (process.env.BROWSER
        ? [
            "big-integer"
        ]
        : [
            "crypto",
            "node-fetch"
        ]),
    plugins
}