#!/usr/bin/env bash
set -e

# Only check dev dependencies have compatible licenses
LICENSES="Apache 1.1;Apache-1.1;BSD*;BSD-2-Clause;BSD-3-Clause;ISC;MIT;WTFPL;Unlicense;"
EXCEPTIONS="colib@0.0.0-development"

$(yarn bin)/license-checker --production --onlyAllow "$LICENSES" --excludePackages "$EXCEPTIONS"
