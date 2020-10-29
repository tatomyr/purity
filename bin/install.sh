#!/bin/bash

# Dependencies
npm i ts-jest typescript jest minify eslint cypress@4.4.1 @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest

# Set up precommit hook
ln -s ../../bin/pre-commit.sh .git/hooks/pre-commit
