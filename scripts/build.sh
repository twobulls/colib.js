#!/usr/bin/env bash
set -e

rm -rf dist || true
mkdir dist
$(yarn bin)/rollup -c