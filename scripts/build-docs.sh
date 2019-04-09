#!/usr/bin/env bash
set -e

$(yarn bin)/typedoc --exclude '**/*.spec.ts' --out docs/api src/core --mode file --theme markdown --readme none  --excludeExternals --excludePrivate --excludeProtected --excludeNotExported