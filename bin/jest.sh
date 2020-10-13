#!/bin/bash

# Installing prerequisites
# npm i -D ts-jest typescript jest

# Backuping tsconfig
tsconfig=`cat tsconfig.json`
echo "$tsconfig" > tsconfig.backup

# Spoofing tsconfig
spoof=`cat tsconfig.spoof`
echo "$spoof" > tsconfig.json

# Running tests
npx jest

# Restoring original tsconfig
echo "$tsconfig" > tsconfig.json

# Removing residuals
# rm -rf node_modules
