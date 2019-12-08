#!/bin/bash

npx eslint\
  ./core.js\
  ./core.test.js\
  ./utils/register-async.js\
  ./utils/register-async.test.js\
  ./lib/\
  ./examples/
