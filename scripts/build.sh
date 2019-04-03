#!/usr/bin/env bash
set -e

rm -rf dist || true
mkdir dist
$(yarn bin)/rollup -c
yarn dts-bundle-generator -o dist/temp.d.ts dist/index.d.ts
rm dist/index.d.ts
rm -rf dist/core
mv dist/temp.d.ts dist/index.d.ts