#!/usr/bin/env bash
set -e

$(yarn bin)/typedoc --exclude '**/*.spec.ts'  --out docs/api src/core --mode file --theme markdown --readme docs/_header.md  --excludeExternals --excludePrivate --excludeProtected --excludeNotExported