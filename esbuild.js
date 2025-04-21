const esbuild = require('esbuild');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['./src/extension.ts'],
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  target: 'node14',
  outfile: 'dist/extension.js',
  sourcemap: !production,
  minify: production
};

if (watch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
  });
} else {
  esbuild.build(buildOptions).catch(() => process.exit(1));
}