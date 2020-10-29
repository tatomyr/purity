#!/bin/bash

rm -rf public/**
touch public/.gitkeep
cp -r src/examples src/playground public
