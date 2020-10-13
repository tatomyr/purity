#!/bin/bash

# Installing prerequisites
# npm i -D ts-jest typescript jest

# Backuping tsconfig
tsconfig=`cat tsconfig.json`
echo "$tsconfig" > tsconfig.backup
npx typescript

# Spoofing tsconfig
spoof=`cat tsconfig.spoof`
echo "$spoof" > tsconfig.json
npx typescript

# Running tests
npx jest $1

# Restoring original tsconfig
echo "$tsconfig" > tsconfig.json
npx typescript

# Removing residuals
# rm -rf node_modules package-lock.json
