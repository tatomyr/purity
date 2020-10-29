#!/bin/bash

rm -rf public/examples public/*.js public/*.d.ts
cp -r src/examples public

npx typescript -w
