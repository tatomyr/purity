#!/bin/bash

rm -rf public/
mkdir public/

cp -r src/examples src/playground public
cp src/index.html public
