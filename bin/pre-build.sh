#!/bin/bash

rm -rf public/
mkdir public/

cp -r src/examples src/playground public
cp src/index.html public
cp src/lz-string.js public
cp src/md5.js public
cp src/reset.css public
