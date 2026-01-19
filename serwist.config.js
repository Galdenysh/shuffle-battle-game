const { spawnSync } = require('node:child_process');
const { serwist } = require('@serwist/next/config');
const crypto = require('node:crypto');

const revision =
  spawnSync('git', ['rev-parse', 'HEAD'], {
    encoding: 'utf-8',
  }).stdout?.trim() ?? crypto.randomUUID();

module.exports = serwist({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  additionalPrecacheEntries: [{ url: '/manifest.webmanifest', revision }],
  maximumFileSizeToCacheInBytes: 31457280,
  manifestTransforms: [
    async (manifestEntries) => {
      const manifest = manifestEntries.filter(
        (entry) => !entry.url.includes('_global-error')
      );
      return { manifest, warnings: [] };
    },
  ],
});
