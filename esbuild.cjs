/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild');
build({
  bundle: true,
  minify: true,
  sourcemap: false,
  platform: 'node',
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.js',
  target: 'node18',
  loader: {
    '.md': 'text',
  },
}).catch(() => process.exit(1));