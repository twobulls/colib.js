#!/usr/bin/env bash

rm -rf dist || true
mkdir dist
$(yarn bin)/rollup -c || true