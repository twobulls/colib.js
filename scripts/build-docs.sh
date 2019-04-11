#!/usr/bin/env bash
set -e

$(yarn bin)/typedoc --exclude '**/*.spec.ts'  --out api src/core --mode file --theme markdown --readme docs/api-header.md --mdEngine gitbook  --excludeExternals --excludePrivate --excludeProtected --excludeNotExported

rm -rf website
mkdir -p website
cp -rf docs/* website
cp -rf api/* website
rm -rf api
rm website/SUMMARY.md website/api-header.md