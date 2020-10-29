#!/bin/bash

# Backuping tsconfig
tsconfig=`cat tsconfig.json`
echo "$tsconfig" > tsconfig.backup
npx typescript

# Spoofing tsconfig
spoof=`cat tsconfig.spoof`
echo "$spoof" > tsconfig.json
npx typescript

# Running tests
# NODE_OPTIONS=--experimental-vm-modules npx jest $1
npx jest $1
# RESULT=$?

# Restoring original tsconfig
echo "$tsconfig" > tsconfig.json
npx typescript

# echo "$RESULT"
# $RESULT || exit $RESULT

echo "Jest finished. Recompiled to ES2020."
